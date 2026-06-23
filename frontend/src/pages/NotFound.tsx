export default function NotFound(){
    return (
        <div className="relative z-10 flex h-full min-h-screen justify-center px-8 md:px-24">
            <div className="max-w-2xl text-black">
                <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
                    404
                </h1>
                <p className="mt-6 text-lg text-black0 md:text-xl">
                    Page not Found
                </p>

            </div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                Button
            </button>
        </div>
    )
}