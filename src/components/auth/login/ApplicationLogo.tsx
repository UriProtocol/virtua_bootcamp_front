import {Image} from "@nextui-org/image";

const ApplicationLogo = (props:any) => (
    <Image 
        width={400}
        height={125} 
        alt="Application logo" 
        src="/images/virtua.png" 
        {...props}>
    </Image>
    
)

export default ApplicationLogo