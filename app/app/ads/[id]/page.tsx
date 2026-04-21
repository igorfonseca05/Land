import { PostDetails } from "./components/pageContent/PostDetails"

export default async function page({params} : {params: Promise<{id: string}>}) {
    const uid = (await params).id.split('-').pop()

  return (
     <div>
        {uid ? (
           <PostDetails uid={uid}/>
        ) : (
          <p>Impossivel buscar anuncio</p>
        )}
     </div>
  )
}