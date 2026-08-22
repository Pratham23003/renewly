import User from '../models/user.model.js';

export const getUser = async(req, res, next) => {
    try{

        const user = await User.findById(req.params.id).select('-password');        //get users by id

        if(!user){
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        if(req.user._id.toString() !== req.params.id.toString()){
            const error = new Error("You are not authorized to view details");
            error.statusCode = 403;
            throw error;
        }

        res.status(200).json({ success: true, data: user });
    }
    catch (err){
        next(err);
    }
}

export const editUserDetails = async (req, res, next) => {
    try{
        const user = await User.findById(req.params.id);
        
        if(!user){
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        if(req.user._id.toString() !== req.params.id.toString()){
            const error = new Error("You are not authorized to edit details");
            error.statusCode = 403;
            throw error;
        }

        const allowedEditFields = ["name"];
        const isEditAllowed = Object.keys(req.body).every((key) => allowedEditFields.includes(key));

        if(!isEditAllowed){
            const error = new Error('Not allowed to edit');
            error.statusCode = 403;
            throw error;
        }
        else{
            if (Object.hasOwn(req.body, "name")) {
                user.name = req.body.name;
            }

            await user.save();
            const userData = user.toObject();
            delete userData.password;
            res.status(200).json({ success: true, message: "Details edited successfully", data: userData });
        }
    }
    catch (err){
        next (err);
    }
}

export const deleteUser = async (req, res, next) => {
    try{
        const user = await User.findById(req.params.id);
        if(!user){
            const error = new Error(`User Not Found`);
            error.statusCode = 404;
            throw error;
        }

        if(req.user._id.toString() !== req.params.id.toString()){
            const error = new Error("You are not authorized to delete this user");
            error.statusCode = 403;
            throw error;
        }

        await user.deleteOne();
    
        res.status(200).json({ success: true, message: "user deleted successfully"});
    }
    catch (err){
        next(err);
    }
}
