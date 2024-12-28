import { ServerProvider } from "./ServerProvider";
import { setInitialized } from "./slices/client";
import { setUser } from "./slices/user";
import { store } from "./store";

export async function initialize(provider: ServerProvider) {
  const user = await provider.auth.getUser();
  if (user) {
    store.dispatch(setUser(user));
  }
  store.dispatch(setInitialized(true));
}
