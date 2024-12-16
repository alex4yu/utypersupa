"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type SignupParams = {
  username: string,
  email: string;
  password: string;
};
export const signUpAction = async ({username, email, password}: SignupParams) => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        user_name: username
      }
    }
  });

  if (error) {
    console.log(error.code + " " + error.message);
    return {data: {error: error.message}};
  } else {
    return {data: {success: ''}};
  }
};

type LoginParams = {
  email: string;
  password: string;
};
export const logInAction = async ({email, password}: LoginParams) => {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log(error);
    return {error: error.message};
  }

  return redirect("/Accounts");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const getUserProfile = async () => {
  const supabase = await createClient()
  
  const {data: { user }} = await supabase.auth.getUser()
  if(!user){
    return {error: "no user"};
  }
  else{
    try {
      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username`)
        .eq('id', user?.id)
        .single()

      if (error && status !== 406) {
        console.log(error)
        throw error
      }

      if (data) {
        return({data: {email: user.email, username: data.username}});
      }
      } catch (error) {
        return ({error: "error loading user data"});
      }
  }
}

export const getUserStats = async () => {
  console.log("get user stats");
  const supabase = await createClient()
  const {data: { user }} = await supabase.auth.getUser()
  if(!user){
    return {error: "no user"};
  }
  else{
    try{
      const { data: userData, error: userDataError } = await supabase
        .from('user_basic_data')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userDataError) {
        console.error('Error fetching user data:', userDataError.message);
      } else {
        return ({
          bestWpm: userData.best_wpm, 
          lifeAccuracy: userData.life_accuracy,
          totalWords: userData.total_words 
        });
      }
    } catch (error) {
      return ({error: "error loading user data"});
    }
  }
}

type TestResult = {
  wpm: number,
  words: number,
  charsCorrect: number,
  totalChars: number,
}
export const updateUserStats = async({wpm, words, charsCorrect, totalChars}: TestResult) => {
  console.log("Entering updateUserStats function");
  console.log("try update stats");
  const supabase = await createClient()
  const {data: { user }} = await supabase.auth.getUser()
  if(!user){
    console.log("try update stats but no user")
    return {error: "no user"};
  }
  else{
    try{
      const { data: userData, error: userDataError } = await supabase
        .from('user_basic_data')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userDataError) {
        console.error('Error fetching user data:', userDataError.message);
      } else {
        const bestWpm = userData.best_wpm;
        const lifeAccuracy = userData.life_accuracy;
        const totalWords = userData.total_words;
        const totalCharacters = userData.total_characters

        const newBestWpm = Math.max(bestWpm, wpm);
        const newTotalWords = totalWords + words;
        const newTotalChars = totalCharacters + totalChars;
        const newAccuracy = (lifeAccuracy * totalCharacters + charsCorrect) / newTotalChars;
        
        console.log("trying to update stats")
        try{
          const { error: updateError } = await supabase
          .from("user_basic_data")
          .update({
            best_wpm: newBestWpm,
            life_accuracy: newAccuracy,
            total_words: newTotalWords,
            total_characters: newTotalChars
          })
          .eq("id", user.id);

          if (updateError) {
            throw new Error(`Failed to update user data: ${updateError.message}`);
          }
        } catch(error){
          console.error(error);
        }
        

      }
    } catch (error) {
      console.log("error loading user data");
    }
    return;
  }
}
