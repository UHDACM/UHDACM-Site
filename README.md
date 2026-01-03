# UHD ACM Site
This repository contains the codebase for the UHD ACM website. It is organized as a monorepo.

## Code Stack
This is a monorepo, each folder will contain a different part of this project.

That said, each folder will also explain the techstack in their respective **readme**.

## Contributing<br/>
Fork the github repository, clone your fork locally, make changes, push them to your fork, submit your branch for pull.

[This video](https://www.youtube.com/watch?v=LSJMUqDDPJw) is a great overview of how to **fork -> clone -> edit -> push**.

> Note: modification is reserved for UHD ACM club members (and a few individuals)

## Monorepo Structure
See each monorepo's readme for more info.
### ./cms:<br/>
Backend powered by [Strapi](https://strapi.io/).<br/>
Allows UHD ACM to
### ./site:<br/>
Frontend built with [Next.js](https://nextjs.org/).<br/>
Relies on ./cms for page content.<br/>

## How to Run
The run scripts for each part of the project are located in their respective folder's **readme**. 

To run the entire project, ensure that all parts (e.g., `./cms` and `./site`) are running simultaneously.
