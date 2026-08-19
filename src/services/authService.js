    import api from "../api/axiosClient";

    export const login = async (loginData) => {

        try {

            const response = await api.post("/auth", loginData);
            return response.data;

        } catch (error) {

            if (error.response) {

                throw error.response.data;
            }

            throw {
                success: false,
                message: "Unable to connect to the server."
            };
        }
    };  





    export const forgotPassword = async  (formData)=>{

        try{
            const response = await api.post("/auth/forgot-password", formData);
            return response.data;
        }

        catch (error){

            if(error.response){
                throw error.response.data;
            }

              throw {
                success: false,
                message: "Unable to connect to the server."
            };

        }  
      };


      export const verifyOtp = async(FormData) =>{
        try{

            const response= await api.post("/auth/verify-otp", FormData);
            return response.data;

        }

        catch(error){

            if(error.response){
                throw error.response.data;
            }

            throw{
                success:false,
                message:"unable to connect to the server"
            }

        }
      }





      export const resetPassword = async (formData) => {
  try {
    const response = await api.post("/auth/reset-password", formData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }

    throw {
      success: false,
      message: "Unable to connect to the server",
    };
  }
};








export const resendOtp = async (formData) => {
  try {
    const response = await api.post("/auth/resend-otp", formData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};