import coffeeImg from "./coffee.jpg";
import teaImg from "./tea.jpg";
import juiceImg from "./juice.jpg";

import cappuccinoImg from "./cappuccino.jpg";
import greenTeaImg from "./greenTea.jpg";
import brownieImg from "./brownie.jpg";
import mangoJuiceImg from "./mangoJuice.jpg";

export const categoryItem = [
  {
    category_title: "Coffee",
    image: coffeeImg,
  },
  {
    category_title: "Tea",
    image: teaImg,
  },
  {
    category_title: "Juices",
    image: juiceImg,
  },
];

export const product = [
  {
    _id: "1",
    name: "Cappuccino",
    description: "A classic Italian coffee with steamed milk foam.",
    price: 300,
    image: cappuccinoImg,
    category: "Coffee",
    date: "2025-09-20",
  },
  {
    _id: "2",
    name: "Green Tea",
    description: "Refreshing and healthy hot green tea.",
    price: 80,
    image: greenTeaImg,
    category: "Tea",
    date: "2025-09-20",
  },
  {
    _id: "3",
    name: "Chocolate Brownie",
    description: "Rich chocolate brownie served warm.",
    price: 250,
    image: brownieImg,
    category: "Desserts",
    date: "2025-09-20",
  },
  {
    _id: "4",
    name: "Mango Juice",
    description: "Fresh seasonal mango juice with no added sugar.",
    price: 400,
    image: mangoJuiceImg,
    category: "Juices",
    date: "2025-09-20",
  },
  {
    _id: "5",
    name: "Juice",
    description: "Fresh seasonal juice with no added sugar.",
    price: 300,
    image: juiceImg,
    category: "Juices",
    date: "2025-09-20",
  },
  {
    _id: "6",
    name: "Coffee",
    description: "Best hangover medicine",
    price: 250,
    image: coffeeImg,
    category: "Coffee",
    date: "2025-09-20",
  },
  {
    _id: "7",
    name: "Tea",
    description: "Mood freshner with no / low / required sugar.",
    price: 50,
    image: greenTeaImg,
    category: "Tea",
    date: "2025-09-20",
  },
];
