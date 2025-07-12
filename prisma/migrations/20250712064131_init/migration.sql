-- CreateTable
CREATE TABLE "UserSubmission" (
    "id" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "income" DOUBLE PRECISION NOT NULL,
    "dependents" INTEGER NOT NULL,
    "riskTolerance" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSubmission_pkey" PRIMARY KEY ("id")
);
