import { ServerProvider, User } from "../ServerProvider";
import supabase from "./supabase";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";

function userFromSession(session: Session) {
  return {
    email: session.user?.email ?? "",
    name: session.user?.user_metadata?.name ?? "",
    avatar: session.user?.user_metadata?.avatar_url ?? "",
  };
}
function userFromData(user: SupabaseUser) {
  return {
    email: user.email ?? "",
    name: user.user_metadata?.name ?? "",
    avatar: user.user_metadata?.avatar_url ?? "",
  };
}

export const provider: ServerProvider = {
  auth: {
    async getUser() {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        throw error;
      }
      const user: User | null = data.session
        ? userFromSession(data.session)
        : null;
      return user;
    },
    async createUser(email, password) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        throw error;
      }
      if (!data.user) {
        throw new Error("User not created");
      }
      return userFromData(data.user);
    },
  },
};
