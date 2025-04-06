import bcrypt from "bcryptjs";;
export async function encryptPassword(password) {
    return await bcrypt.hash(password,10);
}