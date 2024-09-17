import { productImgs } from "contains/fakeData";
import { featureImages } from "contains/appData";

import hero1 from "images/hero/01.png";
import hero3 from "images/hero/03.png";
import hero4 from "images/hero/04.png";
import hero5 from "images/hero/05.png";
import hero6 from "images/hero/06.png";
import hero7 from "images/hero/07.png";
import hero8 from "images/hero/08.png";
import hero9 from "images/hero/09.png";
import hero10 from "images/hero/10.png";
import hero11 from "images/hero/11.png";
import hero12 from "images/hero/12.png";
import hero13 from "images/hero/13.png";
import hero14 from "images/hero/14.png";
import hero15 from "images/hero/15.png";
import hero16 from "images/hero/16.png";
import hero17 from "images/hero/17.png";
import hero18 from "images/hero/18.png";
import hero19 from "images/hero/19.png";
import hero20 from "images/hero/20.png";
import hero21 from "images/hero/21.png";
import hero22 from "images/hero/22.png";
import hero23 from "images/hero/23.png";

import productVariantImg2 from "images/products/v2.jpg";
import productVariantImg3 from "images/products/v3.jpg";
import productVariantImg4 from "images/products/v4.jpg";
import productVariantImg5 from "images/products/v5.jpg";
import productVariantImg6 from "images/products/v6.jpg";
//
import productSport1 from "images/products/sport-1.png";
import productSport2 from "images/products/sport-2.png";
import productSport3 from "images/products/sport-3.png";
import productSport4 from "images/products/sport-4.png";
import productSport5 from "images/products/sport-5.png";
import productSport6 from "images/products/sport-6.png";
import productSport7 from "images/products/sport-7.png";
import productSport8 from "images/products/sport-8.png";

//
export const BACKGROUND_IMGS = [hero1, hero3, hero4, hero5, hero6, hero7, hero8, hero9, hero10, hero11, hero12, hero13, hero14, hero15, hero16, hero17, hero18, hero19, hero20, hero21, hero22, hero23];

export interface ProductVariant {
  id: number;
  name: string;
  thumbnail?: string;
  color?: string;
  featuredImage: string;
}
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  tags: string[];
  link: "/product-detail/";
  variants?: ProductVariant[];
  variantType?: "color" | "image";
  sizes?: string[];
  allOfSizes?: string[];
  status?: "New in" | "limited edition" | "Sold Out" | "50% Discount";
}

export interface Features {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  tags: string[];
  link: "/product-detail/";
  variants?: ProductVariant[];
  variantType?: "color" | "image";
  sizes?: string[];
  allOfSizes?: string[];
  status?: "New in" | "limited edition" | "Sold Out" | "50% Discount";
}


const DEMO_VARIANTS: ProductVariant[] = [
  {
    id: 1,
    name: "Black",
    thumbnail: productVariantImg6,
    featuredImage: productImgs[0],
  },
  {
    id: 2,
    name: "White",
    thumbnail: productVariantImg2,
    featuredImage: productImgs[1],
  },
  {
    id: 3,
    name: "Orange",
    thumbnail: productVariantImg3,
    featuredImage: productImgs[2],
  },
  {
    id: 4,
    name: "Sky Blue",
    thumbnail: productVariantImg4,
    featuredImage: productImgs[3],
  },
  {
    id: 5,
    name: "Natural",
    thumbnail: productVariantImg5,
    featuredImage: productImgs[4],
  },
];
const DEMO_VARIANT_COLORS: ProductVariant[] = [
  {
    id: 1,
    name: "Violet",
    color: "bg-violet-400",
    featuredImage: productImgs[0],
  },
  {
    id: 2,
    name: "Yellow",
    color: "bg-yellow-400",
    featuredImage: productImgs[1],
  },
  {
    id: 3,
    name: "Orange",
    color: "bg-orange-400",
    featuredImage: productImgs[2],
  },
  {
    id: 4,
    name: "Sky Blue",
    color: "bg-sky-400",
    featuredImage: productImgs[3],
  },
  {
    id: 5,
    name: "Green",
    color: "bg-green-400",
    featuredImage: productImgs[4],
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Rey Nylon Backpack",
    description: "Brown cockroach wings",
    price: 74,
    image: productImgs[16],
    category: "Category 1",
    tags: ["tag1", "tag2"],
    link: "/product-detail/",
    variants: DEMO_VARIANTS,
    variantType: "image",
    sizes: ["XS", "S", "M", "L", "XL"],
    allOfSizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    status: "New in",
  },
  {
    id: 2,
    name: 'Round Buckle 1" Belt',
    description: "Classic green",
    price: 68,
    image: productImgs[1],
    category: "Category 1",
    tags: ["tag1", "tag2"],
    link: "/product-detail/",
    variants: DEMO_VARIANT_COLORS,
    variantType: "color",
    status: "50% Discount",
  },
  {
    id: 3,
    name: "Waffle Knit Beanie",
    description: "New blue aqua",
    price: 132,
    image: productImgs[15],
    category: "Category 1",
    tags: ["tag1", "tag2"],
    link: "/product-detail/",
    variants: DEMO_VARIANTS,
    variantType: "image",
    sizes: ["S", "M", "L", "XL"],
    allOfSizes: ["S", "M", "L", "XL", "2XL", "3XL"],
  },
  {
    id: 4,
    name: "Travel Pet Carrier",
    description: "Dark pink 2023",
    price: 28,
    image: productImgs[3],
    category: "Category 1",
    tags: ["tag1", "tag2"],
    variants: DEMO_VARIANT_COLORS,
    variantType: "color",
    link: "/product-detail/",
    status: "Sold Out",
  },
  {
    id: 5,
    name: "Leather Gloves",
    description: "Perfect mint green",
    price: 42,
    image: productImgs[4],
    category: "Category 1",
    tags: ["tag1", "tag2"],
    variants: DEMO_VARIANTS,
    variantType: "image",
    sizes: ["XS", "S", "M", "L", "XL"],
    allOfSizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    link: "/product-detail/",
  },
  {
    id: 6,
    name: "Hoodie Sweatshirt",
    description: "New design 2023",
    price: 30,
    image: productImgs[5],
    category: "Category 1",
    tags: ["tag1", "tag2"],
    variantType: "color",
    variants: DEMO_VARIANT_COLORS,
    link: "/product-detail/",
  },
  {
    id: 7,
    name: "Wool Cashmere Jacket",
    description: "Matte black",
    price: 12,
    image: productImgs[8],
    category: "Category 1",
    tags: ["tag1", "tag2"],
    variants: DEMO_VARIANTS,
    variantType: "image",
    link: "/product-detail/",
    status: "New in",
  },
  {
    id: 8,
    name: "Ella Leather Tote",
    description: "Cream pink",
    price: 145,
    image: productImgs[7],
    category: "Category 1",
    tags: ["tag1", "tag2"],
    variants: DEMO_VARIANTS,
    variantType: "image",
    sizes: ["XS", "S", "M", "L", "XL"],
    allOfSizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    link: "/product-detail/",
    status: "limited edition",
  },
];

export const SPORT_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Mastermind Toys",
    description: "Brown cockroach wings",
    price: 74,
    image: productSport1,
    category: "Category 1",
    tags: ["tag1", "tag2"],
    link: "/product-detail/",
    variants: DEMO_VARIANT_COLORS,
    variantType: "color",
    sizes: ["XS", "S", "M", "L", "XL"],
    allOfSizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    status: "New in",
  },
  {
    id: 2,
    name: "Jump Rope Kids",
    description: "Classic green",
    price: 68,
    image: productSport2,
    category: "Category 1",
    tags: ["tag1", "tag2"],
    link: "/product-detail/",
    variants: DEMO_VARIANT_COLORS,
    variantType: "color",
    status: "50% Discount",
  },
  {
    id: 3,
    name: "Tee Ball Beanie",
    description: "New blue aqua",
    price: 132,
    image: productSport3,
    category: "Category 1",
    tags: ["tag1", "tag2"],
    link: "/product-detail/",
    variants: DEMO_VARIANTS,
    variantType: "image",
    sizes: ["S", "M", "L", "XL"],
    allOfSizes: ["S", "M", "L", "XL", "2XL", "3XL"],
  },
  {
    id: 4,
    name: "Rubber Table Tennis",
    description: "Dark pink 2023",
    price: 28,
    image: productSport4,
    category: "Category 1",
    tags: ["tag1", "tag2"],
    variants: DEMO_VARIANT_COLORS,
    variantType: "color",
    link: "/product-detail/",
    status: "Sold Out",
  },
  {
    id: 5,
    name: "Classic Blue Rugby",
    description: "Perfect mint green",
    price: 42,
    image: productSport5,
    category: "Category 1",
    tags: ["tag1", "tag2"],
    variants: DEMO_VARIANTS,
    variantType: "image",
    sizes: ["XS", "S", "M", "L", "XL"],
    allOfSizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    link: "/product-detail/",
  },
  {
    id: 6,
    name: "Manhattan Toy WRT",
    description: "New design 2023",
    price: 30,
    image: productSport6,
    category: "Category 1",
    tags: ["tag1", "tag2"],
    variantType: "color",
    variants: DEMO_VARIANT_COLORS,
    link: "/product-detail/",
  },
  {
    id: 7,
    name: "Tabletop Football ",
    description: "Matte black",
    price: 12,
    image: productSport7,
    category: "Category 1",
    tags: ["tag1", "tag2"],
    variants: DEMO_VARIANTS,
    variantType: "image",
    link: "/product-detail/",
    status: "New in",
  },
  {
    id: 8,
    name: "Pvc Catching Toy",
    description: "Cream pink",
    price: 145,
    image: productSport8,
    category: "Category 1",
    tags: ["tag1", "tag2"],
    variants: DEMO_VARIANT_COLORS,
    variantType: "color",
    sizes: ["XS", "S", "M", "L", "XL"],
    allOfSizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    link: "/product-detail/",
    status: "limited edition",
  },
];

export const FEATURES: Features[] = [
  {
    id: 1,
    name: "TECHNICAL",
    description: "Establishing the important building blocks to develop individual styles of play",
    price: 74,
    image: BACKGROUND_IMGS[3],
    category: "Category 1",
    tags: ["tag1", "tag2"],
    link: "/product-detail/",
    variants: DEMO_VARIANTS,
    variantType: "image",
    sizes: ["XS", "S", "M", "L", "XL"],
    allOfSizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    status: "New in",
  },
  {
    id: 2,
    name: 'PHYSICAL',
    description: "Building endurance and skill through specific fitness drills and exercises",
    price: 68,
    image: BACKGROUND_IMGS[15],
    category: "Category 1",
    tags: ["tag1", "tag2"],
    link: "/product-detail/",
    variants: DEMO_VARIANT_COLORS,
    variantType: "color",
    status: "50% Discount",
  },
  {
    id: 3,
    name: "TACTICAL",
    description: "Improving decision-making and reacting to in-game situations",
    price: 132,
    image: BACKGROUND_IMGS[9],
    category: "Category 1",
    tags: ["tag1", "tag2"],
    link: "/product-detail/",
    variants: DEMO_VARIANTS,
    variantType: "image",
    sizes: ["S", "M", "L", "XL"],
    allOfSizes: ["S", "M", "L", "XL", "2XL", "3XL"],
  },
  {
    id: 4,
    name: "MENTAL",
    description: "Developing mental and emotional resilience on and off the court",
    price: 28,
    image: BACKGROUND_IMGS[19],
    category: "Category 1",
    tags: ["tag1", "tag2"],
    variants: DEMO_VARIANT_COLORS,
    variantType: "color",
    link: "/product-detail/",
    status: "Sold Out",
  },
];

export const STAGE_DATA = [
  {
    stage: "Junior - Red Ball - Age 5-7",
    description:
      "Very much focused on hand-eye coordination and establishing strength and timing of a swing",
  },
  {
    stage: "Junior - Orange Ball - Age 7-9",
    description:
      "Progressing from red ball or those players who have the physical ability to wield a racket",
  },
  {
    stage: "Junior - Green Ball - Age 9-11",
    description:
      "Using the full-size court to continue to grow their technical and physical abilities",
  },
  {
    stage: "Junior - Adult Ball - Age 11+",
    description:
      "At this stage, the focus is on transitioning the kids to the demands of adult tennis",
  },
  {
    stage: "Adult - Beginner",
    description:
      "Establishing the fundamental techniques and movements of the game stroke by stroke",
  },
  {
    stage: "Adult - Intermediate",
    description:
      "Players have enough experience and confidence to be comfortable serving and rallying",
  },
  {
    stage: "Adult - Advanced",
    description:
      "Players hit with intensity and are training for competitive match play and tournaments",
  },
];

export const CLOUD_WORDS = [
  "Forehand",
  "Backhand",
  "Slice",
  "Serve",
  "Baseline",
  "Second Serve",
  "First Serve",
  "Drop Shot",
  "Volley",
  "Lob",
  "Drive Volley",
  "Approach Shot",
  "Split Step",
  "Trophey Position",
  "Doubles",
  "Singles",
  "Half-Volley",
  "Smash",
  "Overhead",
  "Rally",
  "Return Of Serve",
  "Top-Spin",
  "Tiebreakers",
  "Touch",
  "Finesse",
  "Movement",
  "Rhythm",
  "Intensity",
  "Power Moving",
  "Accuracy",
  "Racket Back",
  "Load Up",
  "Racket-Head Speed",
  "Plyometrics",
  "Footwork",
  "Mentality",
  "Slice Vs Forehand",
  "2 Volleys and a Smash",
  "Set with Coach",
  "Angled Short Balls",
  "Grand Slam Drill",
  "Serve and Volley",
  "Skipping",
  "Romanian Volley Drill",
  "1 Touch Volley",
  "Chip and Charge",
  "Power Shot",
  "Speed Gun Measurements",
  "Tactical Drill",
  "Cross Court Battles",
  "Tram Lines Rally",
  "2 v 1",
  "Second Serve Only Set",
  "Serve and Finish",
  "Open Stance",
  "Closed Stance",
  "Semi-Open Stance",
  "Tournament Play",
  "Surface Changes",
  "Gravity Belt",
  "Racket Customisation",
  "Breath-Work",
  "Wrong-Footing",
  "In-To-Out"
];

export const QUOTES = [
  {"quote": "I love the winning, I can take the losing, but most of all I love to play.", "author": "Boris Becker"},
  {"quote": "The mark of great sportsmen is not how good they are at their best, but how good they are at their worst.", "author": "Martina Navratilova"},
  {"quote": "Tennis uses the language of life. Advantage, service, fault, break, love – the basic elements of tennis are those of everyday existence, because every match is a life in miniature.", "author": "Andre Agassi"},
  {"quote": "The great part about tennis is you can't run out the clock…. As long as we were still playing, I had a chance.", "author": "Andre Agassi"},
  {"quote": "The next point — that's all you must think about.", "author": "Rod Laver"},
  {"quote": "Tennis is mostly mental. Of course, you must have a lot of physical skill, but you can't play tennis well and not be a good thinker. You win or lose the match before you even go out there.", "author": "Venus Williams"},
  {"quote": "Start where you are. Use what you have. Do what you can.", "author": "Arthur Ashe"},
  {"quote": "I fear no one but respect everyone.", "author": "Roger Federer"},
  {"quote": "It's good when you're out there on a tennis court. There's nowhere to hide. It's all you, tactically, physically, mentally.", "author": "Nick Kyrgios"},
  {"quote": "I think, for me, I just really want to have fun with every match that I play because tennis is a game.", "author": "Naomi Osaka"},
  {"quote": "If you can react the same way to winning and losing, that's a big accomplishment. That quality is important because it stays with you for the rest of your life, and there's going to be a life after tennis that's a lot longer than your tennis life.", "author": "Chris Evert"},
  {"quote": "Success is a journey, not a destination. The doing is often more important than the outcome.", "author": "Arthur Ashe"},
  {"quote": "What makes something special is not just what you have to gain but what you feel there is to lose", "author": "Novak Djokovic"},
  {"quote": "Tennis is a mental game. Everyone is fit; everyone hits great forehands and backhands.", "author": "Novak Djokovic"},
  {"quote": "When the last point is done, we are humans. Give your opponent a hug and say, 'great fight,' and that's all.", "author": "Novak Djokovic"},
  {"quote": "Coaches are very important to players. They're people that are mentors, people that are advising them, people that should be their friends, and somebody you can rely on the tour.", "author": "Andy Murray"},
  {"quote": "I don't play in any tournaments to come second best.", "author": "Kim Clijsters"},
  {"quote": "You don't have to hate your opponents to beat them.", "author": "Stanislas Warinka"},
  {"quote": "As a tennis player, you have to get used to losing every week. Unless you win the tournament, you always go home as a loser. But you have to take the positive out of a defeat and go back to work. Improve to fail better.", "author": "Martina Hingis"},
  {"quote": "I didn't have the same fitness or ability as the other girls, so I had to beat them with my mind.", "author": "Roger Federer"},
  {"quote": "You have to believe in the long-term plan you have, but you need the short-term goals to motivate and inspire you.", "author": "Nick Kyrgios"}
];

