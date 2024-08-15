// create link with token
exports.forgotPassword = (url, token) => {
  return `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #dcdcdc; border-radius: 5px;">
    <h2 style="color: #333333; text-align: center;">Reset Your Password</h2>
    <p style="color: #333333;">Hello,</p>
    <p style="color: #333333;">You recently requested to reset your password. Click the button below to reset it:</p>
    <p style="text-align: center;">
      <a href="https://${url}?token=${token}" style="display: inline-block; padding: 10px 20px; color: #ffffff; background-color: #007bff; border-radius: 5px; text-decoration: none; font-weight: bold;">Reset Password</a>
    </p>
    <p style="color: #333333;">Your reset password token expires in <b>15 min.</b></p>
    <p style="color: #333333;">If you didn't request a password reset, please ignore this email.</p>
    <div style="margin-top: 30px; text-align: center; border-top: 1px solid #dcdcdc; padding-top: 20px;">
      <p style="color: #555555;">Thank you,</p>
      <p style="color: #555555;"><strong>The OpenContribute Team</strong></p>
    </div>
  </div>`;
};

exports.reactivateProfile = (url, token) => {
  return `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #dcdcdc; border-radius: 5px;">
    <h2 style="color: #333333; text-align: center;">Reactivate Your Profile</h2>
    <p style="color: #333333;">Hello,</p>
    <p style="color: #333333;">You recently requested to reactivate your profile. Click the button below to start the reactivation process:</p>
    <p style="text-align: center;">
      <a href="https://${url}?token=${token}" style="display: inline-block; padding: 10px 20px; color: #ffffff; background-color: #007bff; border-radius: 5px; text-decoration: none; font-weight: bold;">Reactivate my Profile</a>
    </p>
    <p style="color: #333333;">Your reactivation link expires in <b>15 min.</b></p>
    <p style="color: #333333;">If you didn't request a reactivation, please ignore this email.</p>
    <div style="margin-top: 30px; text-align: center; border-top: 1px solid #dcdcdc; padding-top: 20px;">
      <p style="color: #555555;">Thank you,</p>
      <p style="color: #555555;"><strong>The OpenContribute Team</strong></p>
    </div>
  </div>`;
};
