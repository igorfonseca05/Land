import { formatFirebaseTime } from "@/app/utils/functions";
import { Avatar } from "../ui/Avatar";
import { PostProps } from "./FeedCard";
import { MdCheckCircle, MdSearch, MdShare } from "react-icons/md";
import { getAuth } from "firebase/auth";
import { LikeButton } from "./LikeButton";
import { SavePost } from "./savePost";
import { DocumentData } from "firebase/firestore";
import { Profile } from "@/app/utils/zod";

export function SearchCard({props}: {props: PostProps | DocumentData}) {

  const convertedFirebaseDate = formatFirebaseTime(props.createdAt).trim().toLowerCase()
  const today = new Date().toLocaleDateString('pt', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).trim().toLowerCase()

  const hourLabelToTest = ['segundo', 'minuto', 'hora']

  const isDiffentData =  convertedFirebaseDate === today 

  // console.log(isDiffentData, convertedFirebaseDate, today)


  return (
    <div className="p-2 md:p-6 space-y-2.5">
      <div className=" flex justify-between ">
        <div className="flex gap-3">
          <Avatar src={props.img} fallback={props.author.split(/\s+/)[0]} />
          <div>
            <p className="font-bold text-sm capitalize">
              {props.author.split(/\s+/)[0]}
            </p>
            <p className="text-xs text-neutral-500 ">
              {/* <span className="capitalize">{location ? location : ""}</span> •{" "} */}
              Postado {`${isDiffentData ? 'há' : 'em'}`} {formatFirebaseTime(props.createdAt)}
            </p>
          </div>
        </div>
        <span
          className="inline-flex gap-x-1 items-center px-3 py-1 rounded-full text-sm 
                  font-semibold bg-green-50 text-green-800"
        >
          <MdSearch />
          Busca
        </span>
      </div>

      {props.title && (
        <p className="text-xl font-semibold text-neutral-900">{props.title}</p>
      )}
      <p className="text-sm text-neutral-900 leading-relaxed ">{props.description}</p>
      {/* <hr className="text-neutral-200"/> */}
      <p className="text-neutral-700 text-sm font-semibold">Requisitos</p>
      <div className=" grid grid-cols-2 gap-4 text-sm text-neutral-900">
        {Object.keys(props.features).map((item, i) => (
          <div className="flex items-center gap-2" key={i}>
            <MdCheckCircle className="text-green-500" />
            <span className="inline-block">{item}</span>
          </div>
        ))}
      </div>
      {getAuth().currentUser && (
        <>
          <hr className="text-neutral-200" />
          <div className="flex justify-between items-center py-1">
            <div className="flex gap-4 items-center">
              <LikeButton postId={props.postId} likesCount={props.likesCount} />
              <MdShare />
            </div>
            <SavePost postId={props.postId} />
          </div>
        </>
      )}
    </div>
  );
}
