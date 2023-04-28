const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    let data = req.body;
    let { fname, lname, phone, email, password, adress, subscription } = data;

    if (!fname || !lname || !email || !password || !adress|| !phone ||!subscription.package || !subscription.period) {
      return res
        .status(400)
        .send({
          status: false,
          message: "Please provide data in request body",
        });
    }

    const existingUser = await userModel.findOne({ email: data.email });
    if (existingUser) {
      return res
        .status(400)
        .send({ status: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);

    let savedData = await userModel.create(data);
    return res
      .status(201)
      .send({ status: true, message: "created successfully", data: savedData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const loginUser = async function (req, res) {
  try {
    let data = req.body;
    let { email, password } = data;

    if (!email||!password)
      return res.status(404).send({
        status: false,
        Msg: "Please provide data in the request body!",
      });


    let checkEmail = await userModel.findOne({ email: email });
    if (!checkEmail) {
      return res
        .status(401)
        .send({ status: false, message: "Email Is incorrect!" });
    }
    

    let encryptPwd = checkEmail.password;

    await bcrypt.compare(password, encryptPwd, function (err, result) {
      if (result) {
        let token = jwt.sign(
          { _id: checkEmail._id.toString() },
          process.env.JWT_SECRET,
          {
            expiresIn: "72h",
          }
        );

        return res.status(201).send({
          status: true,
          message: "User login successfull",
          data: { userId: checkEmail._id, token: token },
        });
      } else {
        return res
          .status(401)
          .send({ status: false, message: "Invalid password!" });
      }
    });
  } catch (err) {
    res.status(500).send({ staus: false, message: err.message });
  }
};


let updateSubcription = async (req, res) => {
  try {

    let data = req.params.userId
    
    const user = await userModel.findByIdAndUpdate(
      data._id,
      {
        $set: {
          subscription: {
            package: data.package,
            period: data.period
          }
        }
      },
      { new: true }
    );

    return res.status(200).send({status:true, message : "user details update succesfully", data: user});
  } catch (err) {
    console.log(err);
    res.status(500).send({status: false, message: err.message});
  }
};

module.exports = { registerUser, loginUser, updateSubcription };
