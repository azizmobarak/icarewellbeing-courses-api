import { UserModel } from "../models/users";

export function initAppAdmin(){
    const user = {
        username:'Billivance Admin',
        email: 'admin@billivance.com',
        password: 'billivance@2023',
        role: '0',
    }
    const users = new UserModel(user);
    users.save();
}