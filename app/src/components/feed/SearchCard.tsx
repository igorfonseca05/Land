import { formatFirebaseTime } from "@/app/utils/functions";
import { Avatar } from "../ui/Avatar";
// import { PostProps } from "./FeedCard";
import { MdCheckCircle, MdSearch, MdShare } from "react-icons/md";
import { getAuth } from "firebase/auth";
import { LikeButton } from "./LikeButton";
import { SavePost } from "./savePost";
import { DocumentData } from "firebase/firestore";
import { PostSchemaType, Profile } from "@/app/utils/zod";

export function SearchCard({...props}: PostSchemaType) {

  // const convertedFirebaseDate = formatFirebaseTime(props.createdAt).trim().toLowerCase()
  // const today = new Date().toLocaleDateString('pt', {
  //   day: '2-digit',
  //   month: 'long',
  //   year: 'numeric'
  // }).trim().toLowerCase()

  // const hourLabelToTest = ['segundo', 'minuto', 'hora']

  // const isDiffentData =  convertedFirebaseDate === today 

  // // console.log(isDiffentData, convertedFirebaseDate, today)


  return (
    <div className="p-2 md:p-6 space-y-2.5">
     
    </div>
  );
}
