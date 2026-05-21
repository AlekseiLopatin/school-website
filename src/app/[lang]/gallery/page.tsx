import { createServerClient } from "@/utils/supabase/server";
import { getDictionary } from "@/lib/dictionaries";
import { Navbar } from "@/components/Navbar";
import { ShuffleArt } from "@/components/ShuffleArt";
import { BulkUploadForm } from "@/components/BulkUploadForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoutButton } from "@/components/LogoutButton";
import Link from "next/link";

export default async function GalleryPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const currentLang = lang as 'en' | 'th' | 'zh';
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: art } = await supabase.from("student_art").select("id, image_url");

  const dict = getDictionary(currentLang);
  const t = dict.gallery;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar lang={lang} isLoggedIn={!!user} />
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        
        {/* HEADER WITH 3 LANGUAGES */}
        <header className="flex justify-between items-center mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
              {t.title}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex gap-3 mt-2 text-xs font-bold uppercase tracking-widest">
              {['en', 'th', 'zh'].map((l) => (
                <Link
                  key={l}
                  href={`/${l}/gallery`}
                  className={currentLang === l ? "text-blue-600" : "opacity-40 hover:opacity-100"}
                >
                  {l}
                </Link>
              ))}
            </div>

            <ThemeToggle />
            {user && <LogoutButton />}
          </div>

        </header>

        <main className="flex flex-col items-center justify-center py-10">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 italic mb-10 text-center">
            {t.subtitle}
          </p>

          {art && art.length > 0 ? (
            <ShuffleArt initialArt={art} buttonText={t.next} />
          ) : (
            <div className="p-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400">
              {t.noArt}
            </div>
          )}

          {user && (
            <section className="w-full max-w-2xl mt-24 pt-12 border-t border-slate-200 dark:border-slate-800">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 text-center">
                {t.adminTitle}
              </h2>
              <BulkUploadForm />
            </section>
          )}
        </main>
      </div>

      
    </div>
  );
}