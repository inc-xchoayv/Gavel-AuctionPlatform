import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { GuestOnlyRoute, ProtectedRoute } from "./auth/RouteGuards";

import Home from "./pages/Home";
import Auctions from "./pages/Auctions";
import AuctionDetail from "./pages/AuctionDetail";
import PlaceBid from "./pages/PlaceBid";
import MyParticipations from "./pages/MyParticipations";
import MyLots from "./pages/MyLots";
import AddLot from "./pages/AddLot";
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminAuctions from "./pages/AdminAuctions";
import AdminReports from "./pages/AdminReports";
import NotFound from "./pages/NotFound";

// Երթուղիներ (routes). URL-ը որոշում է, թե որ էջ-կոմպոնենտը ցուցադրվի <Outlet/>-ում
const user = (el) => <ProtectedRoute role="user">{el}</ProtectedRoute>;
const admin = (el) => <ProtectedRoute role="admin">{el}</ProtectedRoute>;

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Բոլորի համար բաց էջեր */}
        <Route path="/" element={<Home />} />
        <Route path="/auctions" element={<Auctions />} />
        <Route path="/auction-detail" element={<AuctionDetail />} />
        <Route path="/profile/:userId" element={<PublicProfile />} />

        {/* Միայն հյուրերի համար */}
        <Route path="/login" element={<GuestOnlyRoute><Login /></GuestOnlyRoute>} />
        <Route path="/register" element={<GuestOnlyRoute><Register /></GuestOnlyRoute>} />

        {/* Միայն մուտք գործած օգտատերերի համար */}
        <Route path="/place-bid" element={user(<PlaceBid />)} />
        <Route path="/my-participations" element={user(<MyParticipations />)} />
        <Route path="/my-lots" element={user(<MyLots />)} />
        <Route path="/add-lot" element={user(<AddLot />)} />
        <Route path="/profile" element={user(<Profile />)} />
        <Route path="/verification" element={user(<Profile initialTab="verification" />)} />

        {/* Միայն ադմինի համար */}
        <Route path="/admin-dashboard" element={admin(<AdminDashboard />)} />
        <Route path="/admin-users" element={admin(<AdminUsers />)} />
        <Route path="/admin-auctions" element={admin(<AdminAuctions />)} />
        <Route path="/admin-reports" element={admin(<AdminReports />)} />

        {/* Մնացած ամեն ինչ՝ 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
