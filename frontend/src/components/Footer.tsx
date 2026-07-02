export default function Footer() {
    return (
        <footer className="sticky bottom-0 py-8 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Chris Asmer. All rights reserved.
        </footer>
    );
}