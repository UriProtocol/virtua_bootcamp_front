import { Card, CardBody, CardHeader } from "@nextui-org/card";

interface AuthCardProps {
	logo?: React.ReactNode;
	children: React.ReactNode;
}  

export default function AuthCard({ logo, children }: AuthCardProps) {
	return (
		<div className="min-h-screen flex flex-col justify-center items-center pt-6 sm:pt-0">
			 <Card className="border-none bg-white/30 min-w-[450px] backdrop-blur-md" radius="lg">
				<CardHeader className="pb-5 pt-10 px-4 flex-col items-center">
					{logo}
					<h4 className="font-medium text-large flex justify-start text-regal-blue">Iniciar sesión</h4>
				</CardHeader>
				<CardBody className="overflow-visible py-2 pb-10">
					{children}
				</CardBody>
			</Card>
    	</div>
	);
}