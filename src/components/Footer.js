import { Typography } from "@material-tailwind/react";

export default function Footer() {
    return (
        <footer className="w-full bg-black text-white"
            style={{ position: "fixed", bottom: "0", backgroundImage: 'linear-gradient(109.6deg, rgb(36, 45, 57) 11.2%, rgb(16, 37, 60) 51.2%, rgb(0, 0, 0) 98.6%)' }}>
            <Typography color="blue-gray" className="text-center font-normal mb-5" style={{ color: "white" }}>
                &copy; Built by Team Medusaverse
            </Typography>
        </footer>
    );
}