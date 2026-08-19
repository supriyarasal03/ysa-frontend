import api from "../api/axiosClient";

const COACH_REGISTRATION_URL = "/coach-registration";

export const registerCoach = async (coachData) => {

    const formData = new FormData();

    formData.append("fullName", coachData.fullName);
    formData.append("email", coachData.email);
    formData.append("contactNumber", coachData.phone);
    formData.append("gender", coachData.gender);
    formData.append("dateOfBirth", coachData.dateOfBirth);
    formData.append("experience", coachData.experience);
    formData.append("sports", coachData.sports.join(","));
    formData.append("certification", coachData.certification);
    formData.append("address", coachData.address);
    formData.append("city", coachData.city);
    formData.append("pincode", coachData.pincode);
    formData.append("about", coachData.about);

    if (coachData.resume) {
        formData.append("resume", coachData.resume);
    }

    const response = await api.post(
        COACH_REGISTRATION_URL,
        formData
    );

    return response.data;
};