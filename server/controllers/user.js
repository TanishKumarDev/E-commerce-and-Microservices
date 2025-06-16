import TryCatch from "../utils/TryCatch.js";

export const loginUser = TryCatch(async (req, res) => {
    const { email} = req.body; // get email from req.body

    res.json({email: email}); // send email
});

