import {
  type RouteConfig,
  route,
  index,
  layout
} from "@react-router/dev/routes";
export default [
    layout('./utils/layout/public_layout.tsx',[
       index('./routes/home/home.tsx'),
    route("login", "./routes/login/login.tsx"),
    route("register", "./routes/register/register.tsx"),
    route("news", "./routes/Get_all_articles/Get_all_articles.tsx"),
    route("news/:id", "./routes/Get_article/Get_article.tsx"),
    route("request_password_reset", "./routes/request_password_reset/request_password_reset.tsx"),
    // route("reset/password/:id", "./routes/reset_password/reset_password.tsx"),
    route("auth/callback", './routes/Google_callback_page/Google_callback_page.tsx'), // /profile (PROTECTED)
    ]),
    
    layout('./utils/layout/auth_layout.tsx', [ 
        route("fyp", "./routes/fyp/fyp.tsx"),       // /fyp (PROTECTED)
        route("profile", './routes/profile/profile.tsx') ,// /profile (PROTECTED)
        route("bookmarks", './routes/bookmarks/bookmarks.tsx') ,// /profile (PROTECTED)
        route("edit_profile", './routes/edit_profile/edit_profile.tsx') ,// /profile (PROTECTED)
    ]),
  
    layout('./utils/layout/password_reset_layout.tsx', [ 
        route("reset/password/:id", "./routes/reset_password/reset_password.tsx"),       // /fyp (PROTECTED)
    ]),
  



] satisfies RouteConfig;
