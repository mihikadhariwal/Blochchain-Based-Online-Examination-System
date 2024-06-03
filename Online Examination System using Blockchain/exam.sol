// // // SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract QuizContract {
    struct Question {
        string question;
        string answer;
        string username;
    }

    Question[] public questions;

    function storeQuestions(Question[] memory _questions) public {
        for (uint256 i = 0; i < _questions.length; i++) {
            questions.push(Question(_questions[i].question, _questions[i].answer, _questions[i].username));
        }
    }
}

