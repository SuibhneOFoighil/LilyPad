import { FlowerIcon } from "@/public/icons";
import { Item, SelectedItemsLookup} from "@/types/client";
import ExploreView from "@/components/ExploreView";

export default async function Page() {

  const initProps = await getInitProps();
  const { initItems, selectedLookup } = initProps;

  return (
    <main className="font-serif">
      <header className='h-[50px] flex justify-center items-center gap-2 border-b'>
        <FlowerIcon className='w-6 h-6 text-primary' />
        <h1 className='text-lg'>LilyPad</h1>
      </header>
      <ExploreView initItems={initItems} selectedLookup={selectedLookup}/>
    </main>
  )
}

async function getInitProps() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const initItems = await fetch(`${baseUrl}/api/items`).then((res) => res.json());
  const selectedLookup = initItems.reduce((acc: SelectedItemsLookup, item: Item) => { 
      acc[item.id] = false;
      return acc;
  }, {});
  return {
      initItems: initItems,
      selectedLookup: selectedLookup,
  }
}