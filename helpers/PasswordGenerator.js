/*
  desc: Generate a random password for user who forget password
  Math.random()               -- Generate random number, eg: 0.123456
      .toString(36)           -- Convert  to base-36 : "0.4fzyo82mvyr"
      .slice(-8);             -- Cut off last 8 characters : "yo82mvyr"
*/
module.exports.getRandomPassword = () => {
  return Math.random().toString(36).slice(-8);
}

