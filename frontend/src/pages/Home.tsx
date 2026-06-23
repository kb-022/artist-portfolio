import fih from "../assets/fih.jpg";

export default function Home() {
    return (
        <section className="relative min-h-screen w-full overflow-hidden bg-slate-900">
            <img
                src={fih}
                alt="Hero background"
                className="absolute inset-0 h-full w-full object-cover"
            />

            <div
                className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent"
            ></div>

            <div className="relative z-10 flex h-full min-h-screen flex-col justify-center px-8 md:px-24">
                <div className="max-w-2xl text-white">
                    <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
                        Chris Asmer <br/> Epic Fih.
                    </h1>
                    <p className="mt-6 text-lg text-slate-200 md:text-xl">
                        Avid mayonnaise lover
                        <br/>
                        cool ahh website designed by cool ahh bf
                    </p>
                </div>
            </div>
        </section>
    )
}
