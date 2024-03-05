// A function to get a random int number between intervals
export function getRandomNumber(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// const generateAudienceResponse = (answerChoices, difficultyLevel) => {
//   const totalParticipants = 1000; // Total simulated audience participants
//   let remainingPercentage = 100; // Remaining percentage to distribute among answer choices

//   // Initialize response array
//   const audienceResponse = [];

//   // Adjust the likelihood of the correct answer being chosen based on difficulty level
//   let correctAnswerLikelihood;
//   switch (difficultyLevel) {
//       case 'easy':
//           correctAnswerLikelihood = 0.8; // 80% likelihood for easy questions
//           break;
//       case 'medium':
//           correctAnswerLikelihood = 0.7; // 70% likelihood for medium questions
//           break;
//       case 'hard':
//           correctAnswerLikelihood = 0.6; // 60% likelihood for hard questions
//           break;
//       default:
//           correctAnswerLikelihood = 0.7; // Default to medium difficulty
//           break;
//   }

//   // Assign percentages to each answer choice
//   for (let i = 0; i < answerChoices.length; i++) {
//       let percentage;
//       if (answerChoices[i] === 'correct') {
//           percentage = Math.random() < correctAnswerLikelihood ? Math.floor(Math.random() * 40) + 60 : Math.floor(Math.random() * 60); // Correct answer gets 60-100% or 0-60%
//       } else {
//           percentage = Math.floor(Math.random() * remainingPercentage);
//       }
//       remainingPercentage -= percentage;

//       audienceResponse.push({
//           choice: answerChoices[i],
//           percentage: percentage,
//       });
//   }

//   // Ensure the correct answer has a higher likelihood
//   audienceResponse.sort((a, b) => (b.choice === 'correct' ? 1 : -1));

//   // Adjust total percentages to add up to 100%
//   const totalPercentage = audienceResponse.reduce((acc, cur) => acc + cur.percentage, 0);
//   const scale = totalParticipants / totalPercentage;
//   audienceResponse.forEach(response => {
//       response.percentage = Math.round(response.percentage * scale);
//   });

//   return audienceResponse;
// };

// import React from 'react';

// const AskTheAudienceLifeline = ({ answerChoices }) => {
//     // Simulate audience response
//     const audienceResponse = generateAudienceResponse(answerChoices);

//     return (
//         <div>
//             <p>The audience says:</p>
//             <ul>
//                 {audienceResponse.map((response, index) => (
//                     <li key={index}>{`${response.choice}: ${response.percentage}%`}</li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// // Helper function to generate audience response
// const generateAudienceResponse = (answerChoices) => {
//     const totalParticipants = 1000; // Total simulated audience participants
//     let remainingPercentage = 100; // Remaining percentage to distribute among answer choices

//     // Initialize response array
//     const audienceResponse = [];

//     // Assign random percentages to each answer choice
//     for (let i = 0; i < answerChoices.length; i++) {
//         const percentage = Math.floor(Math.random() * remainingPercentage);
//         remainingPercentage -= percentage;

//         audienceResponse.push({
//             choice: answerChoices[i],
//             percentage: percentage,
//         });
//     }

//     // Ensure the correct answer has the highest percentage
//     audienceResponse.sort((a, b) => (b.choice === 'correct' ? 1 : -1));

//     // Adjust the total percentages to add up to 100
//     const totalPercentage = audienceResponse.reduce((acc, cur) => acc + cur.percentage, 0);
//     const scale = totalParticipants / totalPercentage;
//     audienceResponse.forEach(response => {
//         response.percentage = Math.round(response.percentage * scale);
//     });

//     return audienceResponse;
// };

// export default AskTheAudienceLifeline;
