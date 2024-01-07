import { FlowerIcon } from "@/public/icons"
import { createClient } from "@supabase/supabase-js";
import { Item, SelectedItemsLookup} from "@/types/client";
import ExploreView from "@/components/ExploreView";

async function populateDatabase() {
  const supabaseURL = process.env.SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_KEY!;
  const client = createClient(
      supabaseURL,
      supabaseKey
  );
  const { data, error } = await client
      .from('items')
      .select('*')
      .limit(20)
  if (error) {
      console.log(error);
      return [];
  }
  
  else {
    console.log(data)
    return data
  }
}

var initItems: Item[] = [];
var selectedLookup: SelectedItemsLookup = {};
var props = {};

export default async function Page() {

  if (initItems.length === 0) {
    initItems = await populateDatabase();
    selectedLookup = initItems.reduce((acc: SelectedItemsLookup, item: Item) => { 
      acc[item.id] = false;
      return acc;
    }, {});

    props = {
      initItems: initItems,
      selectedLookup: selectedLookup,
    }
  }

  return (
    <main className="font-serif">
      <header className='h-[50px] flex justify-center items-center gap-2 border-b'>
        <FlowerIcon className='w-6 h-6 text-primary' />
        <h1 className='text-lg'>LilyPad</h1>
      </header>
      <ExploreView initItems={initItems} selectedLookup={selectedLookup} />
    </main>
  )
}