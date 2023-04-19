// // import { UserModel } from "../models/users";
// import { encryptPassword } from "../services/password";
// import bcrypt from 'bcrypt';

// export async function initAppAdmin(){
//     bcrypt.genSalt(10, function (err: any, salt: any) {
//         if (err) return null
//         return bcrypt.hash(password, salt, function (err: any, hash: any) {
//             if (err) return err
//             return hash
//         })
//     })
//     const password = encryptPassword('billivance@2023');
//     const user = {
//         username:'Billivance Admin',
//         email: 'admin@billivance.com',
//         password: password,
//         role: '0',
//     }
//     console.log(user)
//     // const users = new UserModel(user);
//     // users.save();
// }
