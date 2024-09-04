const resources = ['human', 'funds', 'space', 'ideas', 'goods', 'tools', 'support', 'transport'];

exports.resources = resources;

exports.description = {
  resources,
  human: {
    description:
      "Human resources encompass the time, effort, and expertise that individuals contribute to a project. This includes both physical labor and professional skills that drive the project's progress.",
    examples: [
      {
        name: 'Physical Labor',
        description: 'Volunteers, builders, or cleaners who provide hands-on help.',
      },
      {
        name: 'Professional Services',
        description: 'Expertise from professionals like engineers, consultants, or designers.',
      },
    ],
  },
  funds: {
    description:
      'Funds represent the financial contributions necessary to support the project. These contributions cover expenses such as materials, labor, and other essential costs.',
    examples: [
      {
        name: 'Donations',
        description: 'Monetary gifts from individuals or organizations.',
      },
      {
        name: 'Grants',
        description:
          'Financial support provided by institutions or governments, often for specific project goals or initiatives.',
      },
    ],
  },
  space: {
    description:
      'Space refers to physical locations or venues provided for project activities. This can include land, buildings, or containers used for various functions.',
    examples: [
      {
        name: 'Land',
        description: 'Areas for building or cultivation.',
      },
      {
        name: 'Buildings',
        description: 'Warehouses, offices, or venues for project-related events.',
      },
      {
        name: 'Containers',
        description:
          'A container that can be adapted for multiple uses, such as living quarters, meeting spaces, or storage.',
      },
    ],
  },
  ideas: {
    description:
      "Ideas involve the intellectual and creative contributions that shape the project's development and execution. This includes offering innovative concepts, solutions, or improvements.",
    examples: [
      {
        name: 'Concepts',
        description: 'New and innovative ideas or themes that can be integrated into the project.',
      },
      {
        name: 'Solutions',
        description: 'Creative solutions to specific problems or challenges faced by the project.',
      },
      {
        name: 'Improvements',
        description: 'Suggestions for enhancing existing plans or processes to make the project more effective.',
      },
    ],
  },
  goods: {
    description:
      'Goods refer to material resources or supplies essential to the project. These are typically items that are used up or incorporated into the project.',
    examples: [
      {
        name: 'Raw Materials',
        description: 'Building materials like wood, steel, or cement.',
      },
      {
        name: 'Supplies',
        description: 'Nails, screws, fuel, or paint.',
      },
      {
        name: 'Consumables',
        description:
          'Food, water, safety gear (like gloves or masks), and other items that are used and need replenishing.',
      },
    ],
  },
  tools: {
    description:
      'Tools are equipment or devices used to carry out specific tasks within the project. This category includes both small hand tools and large machinery.',
    examples: [
      {
        name: 'Small Tools',
        description: 'Hammers, drills, or chainsaws.',
      },
      {
        name: 'Large Machinery',
        description: 'Excavators, loaders, or cranes.',
      },
    ],
  },
  support: {
    description:
      'Support includes various forms of assistance that ensure the project runs smoothly. This can involve administrative help, logistics, or care for team members.',
    examples: [
      {
        name: 'Administrative Help',
        description: 'Scheduling, communications, or managing paperwork.',
      },
      {
        name: 'Logistics',
        description: 'Coordinating transportation, deliveries, or supplies.',
      },
      {
        name: 'Well-being',
        description: 'Providing meals or accommodations for project members.',
      },
    ],
  },
  transport: {
    description:
      'Transport involves the provision of vehicles or services that enable the movement of people, materials, or equipment to and from project sites.',
    examples: [
      {
        name: 'Vehicles',
        description: 'Trucks, vans, or specialized vehicles for transporting goods.',
      },
      {
        name: 'Logistics Services',
        description: 'Organizing and managing the movement of resources or personnel.',
      },
    ],
  },
  summary: {
    human: 'Human resources bring the hands-on skills and labor needed.',
    funds: 'Provide the financial backbone.',
    space: 'Offers the physical locations for execution.',
    ideas: 'Shape the project’s direction and innovation.',
    goods: 'Materials and supplies necessary for the project.',
    tools: 'Equipment and machinery used to perform tasks.',
    support: 'Ensures smooth operations through administrative and logistical help.',
    transport: 'Facilitates the movement of people, materials, and equipment.',
  },
};
