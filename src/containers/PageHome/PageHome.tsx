import SectionHero from "components/SectionHero/SectionHero";
import SectionAbout from "components/SectionAbout";
import SectionFAQ from "components/SectionFAQ";
import SectionContact from "components/SectionContact";

function PageHome() {
  return (
    <div className="nc-PageHome relative overflow-hidden">
      {/* SECTION HERO */}
      <SectionHero />
      <SectionAbout />
      <SectionFAQ />
      <SectionContact />
    </div>
  );
}

export default PageHome;
