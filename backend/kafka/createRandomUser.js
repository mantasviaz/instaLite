const firstNames = [
  'John',
  'Emma',
  'Michael',
  'Sophia',
  'William',
  'Olivia',
  'James',
  'Amelia',
  'Benjamin',
  'Isabella',
  'Ethan',
  'Mia',
  'Alexander',
  'Charlotte',
  'Henry',
  'Ava',
  'Daniel',
  'Emily',
  'Jackson',
  'Abigail',
  'Liam',
  'Harper',
  'Noah',
  'Evelyn',
  'Samuel',
  'Elizabeth',
  'David',
  'Sofia',
  'Joseph',
  'Grace',
  'Logan',
  'Chloe',
  'Mason',
  'Victoria',
  'Lucas',
  'Avery',
  'Elijah',
  'Ella',
  'Carter',
  'Madison',
  'Alexander',
  'Scarlett',
  'Sebastian',
  'Lily',
  'Jack',
  'Aria',
  'Luke',
  'Grace',
  'Owen',
  'Hannah',
];

const lastNames = [
  'Smith',
  'Johnson',
  'Williams',
  'Jones',
  'Brown',
  'Davis',
  'Miller',
  'Wilson',
  'Moore',
  'Taylor',
  'Anderson',
  'Thomas',
  'Jackson',
  'White',
  'Harris',
  'Martin',
  'Thompson',
  'Garcia',
  'Martinez',
  'Robinson',
  'Clark',
  'Rodriguez',
  'Lewis',
  'Lee',
  'Walker',
  'Hall',
  'Allen',
  'Young',
  'Hernandez',
  'King',
  'Wright',
  'Lopez',
  'Hill',
  'Scott',
  'Green',
  'Adams',
  'Baker',
  'Gonzalez',
  'Nelson',
  'Carter',
  'Mitchell',
  'Perez',
  'Roberts',
  'Turner',
  'Phillips',
  'Campbell',
  'Parker',
  'Evans',
  'Edwards',
  'Collins',
];

// Function to generate random email
function generateEmail(firstName, lastName) {
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
}

// Function to create a random user
function createRandomUser() {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const email = generateEmail(firstName, lastName);

  return {
    username: `${firstName}_${lastName}_${Math.floor(Math.random() * 1000)}`,
    first_name: firstName,
    last_name: lastName,
    email: email,
    password_hash: 'sdlfkas;jfklsdaj;lfk2423u4l2sadfkl;fj*(&!@($YH!@TL:Uf09usdafklsj',
  };
}

// Example usage
const randomUser = createRandomUser();
console.log(randomUser);

module.exports = createRandomUser;
