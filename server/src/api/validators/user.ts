import User from '../../db/models/user'

// Check if the user id is valid
export const validate_user_id = async (id: number): Promise<boolean> => {
    const user: User | null = await User.findByPk(id);
    return user !== null;
}