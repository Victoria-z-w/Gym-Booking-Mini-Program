const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { getDb, save } = require('../data/store');

const WX_APPID = process.env.WX_APPID || '';
const WX_SECRET = process.env.WX_SECRET || '';

function createToken(userId) {
  const token = crypto.randomBytes(24).toString('hex');
  const db = getDb();
  if (!db.sessions) db.sessions = {};
  db.sessions[token] = userId;
  save();
  return token;
}

router.post('/login', async (req, res) => {
  const db = getDb();
  const { code } = req.body;

  if (WX_APPID && WX_SECRET && code) {
    try {
      const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${WX_APPID}&secret=${WX_SECRET}&js_code=${code}&grant_type=authorization_code`;
      const resp = await fetch(url);
      const data = await resp.json();
      if (data.errcode) {
        return res.json({ code: 401, message: data.errmsg || '微信登录失败' });
      }
      let user = db.users.find((u) => u.openid === data.openid);
      if (!user) {
        user = {
          id: Date.now(),
          openid: data.openid,
          nickname: '健身用户',
          avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&q=80',
          memberId: String(Date.now()).slice(-8),
          memberLevel: '普通会员',
          memberExpire: '2027-12-31',
          points: 0,
          remainingCourses: 0,
          couponCount: 0,
          city: '上海市',
        };
        db.users.push(user);
        save();
      }
      const token = createToken(user.id);
      return res.json({ code: 0, data: { token, user } });
    } catch (e) {
      console.error('wx login error', e);
      return res.json({ code: 500, message: '登录服务异常' });
    }
  }

  const user = db.users.find((u) => u.id === 1) || db.users[0];
  const token = createToken(user.id);
  res.json({
    code: 0,
    data: { token, user },
    message: WX_APPID ? '请传入有效 code' : '开发模式登录',
  });
});

module.exports = router;
