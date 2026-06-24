-- CreateTable
CREATE TABLE "PortfolioHolding" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "buyPrice" DOUBLE PRECISION NOT NULL,
    "buyDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortfolioHolding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioHolding_userId_symbol_key" ON "PortfolioHolding"("userId", "symbol");

-- CreateIndex
CREATE INDEX "PortfolioHolding_userId_idx" ON "PortfolioHolding"("userId");

-- CreateIndex
CREATE INDEX "PortfolioHolding_symbol_idx" ON "PortfolioHolding"("symbol");

-- AddForeignKey
ALTER TABLE "PortfolioHolding" ADD CONSTRAINT "PortfolioHolding_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
