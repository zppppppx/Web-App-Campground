const template = `<h3>Hi, dear <%= username %>, </h3><p>This is your password reset link, please keep it secret.</p><p><a href="<%=process.env.DOMAIN%>/resetPassword?token=<%= token %>&user=<%= user %>">Reset your password</a></p>`

module.exports = { template }