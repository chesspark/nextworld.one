import pg from "pg";

const connectionString = process.env.STORAGE_POSTGRES_URL_NON_POOLING;
if (!connectionString) {
  console.error("Set STORAGE_POSTGRES_URL_NON_POOLING env var");
  process.exit(1);
}

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const client = new pg.Client({ connectionString });

async function main() {
  await client.connect();
  console.log("Connected to Supabase Postgres");

  // Create table
  await client.query(`
    CREATE TABLE IF NOT EXISTS people (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      country_code TEXT NOT NULL,
      name TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      image_url TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
  `);
  console.log("Table 'people' created");

  // Create index
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_people_country ON people(country_code);
  `);
  console.log("Index created");

  // Enable RLS but allow all for now (service role bypasses)
  await client.query(`ALTER TABLE people ENABLE ROW LEVEL SECURITY;`);
  await client.query(`
    DROP POLICY IF EXISTS "Allow all for anon" ON people;
    CREATE POLICY "Allow all for anon" ON people
      FOR ALL
      USING (true)
      WITH CHECK (true);
  `);
  console.log("RLS policy set");

  // Seed data
  const seedData = [
    ["FR", "Marie Curie-Joliot", "Quantum Physics Researcher", "Leading breakthroughs in quantum computing at CNRS"],
    ["FR", "Thomas Pesquet", "Astronaut & Engineer", "ESA astronaut advocating for space exploration and education"],
    ["FR", "Audrey Azoulay", "UNESCO Director-General", "Championing global education and cultural heritage"],
    ["FR", "Cédric Villani", "Mathematician & Author", "Fields Medal laureate driving AI policy in Europe"],
    ["FR", "Leïla Slimani", "Author & Activist", "Prix Goncourt winner and advocate for women's rights"],
    ["US", "Elon Musk", "CEO, SpaceX & Tesla", "Pioneering sustainable energy and space exploration"],
    ["US", "Melinda French Gates", "Philanthropist", "Co-chair of the Gates Foundation, global health advocate"],
    ["US", "Sam Altman", "CEO, OpenAI", "Leading the development of safe artificial intelligence"],
    ["US", "Bryan Stevenson", "Civil Rights Lawyer", "Founder of Equal Justice Initiative"],
    ["US", "Fei-Fei Li", "AI Researcher, Stanford", "Pioneer in computer vision and human-centered AI"],
    ["JP", "Akira Yoshino", "Nobel Laureate, Chemistry", "Inventor of the lithium-ion battery"],
    ["JP", "Naomi Osaka", "Athlete & Entrepreneur", "Champion tennis player and mental health advocate"],
    ["JP", "Shinya Yamanaka", "Stem Cell Researcher", "Nobel Prize winner for induced pluripotent stem cells"],
    ["BR", "Marina Silva", "Environmentalist", "Former minister leading Amazon conservation efforts"],
    ["BR", "Miguel Nicolelis", "Neuroscientist", "Pioneering brain-machine interfaces at Duke University"],
    ["IN", "Sundar Pichai", "CEO, Alphabet/Google", "Leading global technology and AI innovation"],
    ["IN", "Kiran Mazumdar-Shaw", "Biotech Pioneer", "Founder of Biocon, advancing affordable healthcare"],
    ["DE", "Özlem Türeci", "Co-founder, BioNTech", "mRNA vaccine pioneer transforming global health"],
    ["KE", "Wangari Maathai Jr.", "Environmental Activist", "Continuing the Green Belt Movement legacy"],
    ["AE", "Sarah Al Amiri", "Minister of State", "Led the UAE Mars Mission, championing space science"],
    ["GB", "Demis Hassabis", "CEO, Google DeepMind", "Nobel laureate advancing artificial intelligence"],
    ["GB", "Malala Yousafzai", "Education Activist", "Nobel Peace Prize laureate, founder of Malala Fund"],
    ["CN", "Tu Youyou", "Pharmacologist", "Nobel laureate who discovered artemisinin for malaria"],
    ["IT", "Samantha Cristoforetti", "Astronaut & Engineer", "ESA astronaut and first Italian woman in space"],
    ["EG", "Zahi Hawass", "Archaeologist", "World-renowned Egyptologist and heritage preservationist"],
    ["ZA", "Naledi Pandor", "Science Minister", "Advancing science diplomacy and education in Africa"],
    ["SG", "Ho Ching", "Businesswoman & Philanthropist", "Former CEO of Temasek, driving sustainable investment"],
    ["MA", "Leila Benali", "Energy Minister", "Leading Morocco's green energy transition"],
    ["SE", "Greta Thunberg", "Climate Activist", "Founder of Fridays for Future movement"],
  ];

  // Check if already seeded
  const { rows } = await client.query("SELECT COUNT(*) as count FROM people");
  if (parseInt(rows[0].count) > 0) {
    console.log(`Table already has ${rows[0].count} rows, skipping seed.`);
  } else {
    for (const [countryCode, name, title, description] of seedData) {
      await client.query(
        "INSERT INTO people (country_code, name, title, description) VALUES ($1, $2, $3, $4)",
        [countryCode, name, title, description]
      );
    }
    console.log(`Seeded ${seedData.length} delegates`);
  }

  await client.end();
  console.log("Done!");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
