import { FlowerIcon } from "@/public/icons";
import ExploreView from "@/components/ExploreView";

export default async function Page() {

  const exploreViewProps = await getExploreViewProps();

  return (
    <main className="font-serif">
      <header className='h-[50px] flex justify-center items-center gap-2 border-b'>
        <FlowerIcon className='w-6 h-6 text-primary' />
        <h1 className='text-lg'>LilyPad</h1>
      </header>
      <ExploreView {...exploreViewProps}/>
    </main>
  )
}

async function getExploreViewProps() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const initFiles = await fetch(`${baseUrl}/api/files`, {
    cache: "no-store"
  }).then((res) => res.json());
  const initCourses = await fetch(`${baseUrl}/api/courses`, {
    cache: "no-store"
  }).then((res) => res.json());

  return {
      initFiles: initFiles,
      initCourses: initCourses,
  }
}