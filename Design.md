## 1. Architecture & Data Model

#### - How you structured your NestJS modules and layers?

I organized all transaction-related work inside a single TransactionModule. This includes the service, controller, DTOs, and the transaction definitions themselves. The service layer focuses on the business logic, while the controller takes care of handling the HTTP requests.

#### - How you designed MongoDB documents/collections?

The MongoDB collection for transactions is defined using Mongoose schemas. Each transaction document includes fields like amount, stage, createdAt, and updatedAt. The stage field uses an enum to represent the transaction’s current status, which helps keep the data consistent and reliable.

#### - Why you chose this structure?

This structure promotes modularity and separation of concerns, making the codebase easier to maintain and extend. By encapsulating transaction-related logic within its own module, we can easily manage dependencies and scale the application as needed. Using Mongoose for MongoDB interactions provides a robust schema definition and validation mechanism, ensuring that our data adheres to the expected format.

#### - What alternatives you rejected and why?

I could have gone with a more monolithic setup where everything lives in one module, but that would have made the code harder to organize, manage, and scale. I also considered using a relational database, but MongoDB turned out to be a better fit. Its flexible schema and scalability work really well with the dynamic structure of transaction data in this application.

## 2. Most Challenging / Riskiest Part

#### - What design decision was risky?

The most challenging and risky design decision was implementing the stage transition logic for transactions. Ensuring that transactions can only move to valid next stages while preventing invalid transitions required careful consideration of the allowed stage flow. This involved defining a clear set of rules and implementing validation checks within the service layer to enforce these rules.

#### - How you mitigated the risk?

To reduce the risk of invalid stage changes, I set up a dedicated map that defines which stage transitions are allowed. I then added a validation method in the TransactionsService that checks every request and makes sure the transition is valid before updating the transaction. I also wrote detailed unit tests to cover different scenarios, so we can be confident the stage-change logic works correctly in all cases. This approach helped catch issues early on and made the stage-management system much more reliable.

## 3. If Implemented in Real Life — What Next?

#### - What would be the next features or improvements?

If this were a real production system, the next steps would include:

1. **Implement Authentication and Authorization**: Secure the API endpoints to ensure that only authorized users can create, update, or view transactions.
2. **Add Comprehensive Logging and Monitoring**: Integrate logging mechanisms to track application behavior and monitor performance metrics for better observability.
3. **Implement Pagination and Filtering**: Enhance the `findAll` method to support pagination and filtering of transactions for better performance and usability.
4. **Optimize Database Indexing**: Analyze query patterns and implement appropriate indexing strategies in MongoDB to improve read and write performance.
5. **Conduct Load Testing**: Perform load testing to ensure the application can handle high traffic and concurrent requests efficiently.
6. **Set Up CI/CD Pipelines**: Establish continuous integration and deployment pipelines to automate testing, building, and deployment processes for faster and more reliable releases.

#### - Why those? (e.g., auditing, rule engine, auth, reporting)

These would enhance the security, performance, and maintainability of the application. Authentication and authorization ensure the legitimacy of transaction data by protecting it from exposure. Logging and monitoring give further insights into the health of the application and help diagnose problems. Pagination and filtering improve user experience when large datasets need to be handled. Database indexing optimizes performance for frequent queries. Load testing ensures the system can scale effectively under demand. Finally, using CI/CD pipelines streamlines development workflows by reducing the chance of human error during deployments, enabling faster delivery of new features.
