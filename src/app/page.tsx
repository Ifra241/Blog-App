import Link from "next/link";
import { Button } from "@/components/ui/button";



export default function Home(){
  return(
    <main  className="min-h-screen bg-gray-100"
    style={{
      backgroundImage:"url('/bg.jpg')",
      backgroundSize:"cover",
      backgroundPosition:"center",
    }} >
     

        <nav className="flex justify-between items-center px-6 py-7">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">📚</span>
            <h1 className="text-xl font-bold">Blogger</h1>
          </div>
          <div>
            <Link
            href="/signup"
              className="text-xl font-semibold px-6 py-3 rounded-2xl shadow-md hover:bg-gray-300 transition-colors duration-200"
      >

              SIGN UP
            </Link>
          </div>
        </nav>

        <section className="flex flex-col items-center justify-center h-[calc(100vh-88px)] text-center space-y-4">
          <h1 className="text-5xl font-serif">Publish Your Passion</h1>
          <p className="text-xl  text-gray-800 font-serif">Create Unique Blog</p>
          <Button>
             <Link href="/signin">Create Your Blog</Link>
          </Button>

        </section>



      
     </main>
  );
  
}
