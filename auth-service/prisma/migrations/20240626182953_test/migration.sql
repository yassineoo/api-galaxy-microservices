-- CreateTable
CREATE TABLE "users" (
    "UserID" SERIAL NOT NULL,
    "Username" VARCHAR(255) NOT NULL,
    "Email" VARCHAR(255) NOT NULL,
    "PasswordHash" VARCHAR(60),
    "DateCreated" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "LastLogin" TIMESTAMP(3),
    "IsActive" BOOLEAN DEFAULT true,
    "IsTwoFactor" BOOLEAN DEFAULT false,
    "role" VARCHAR(50),
    "PhoneNumber" VARCHAR(20),
    "Verified" BOOLEAN DEFAULT false,
    "Image" VARCHAR(255),

    CONSTRAINT "users_pkey" PRIMARY KEY ("UserID")
);

-- CreateTable
CREATE TABLE "billinghistory" (
    "HistoryID" SERIAL NOT NULL,
    "UserID" INTEGER NOT NULL,
    "InvoiceID" INTEGER NOT NULL,
    "PaymentDate" TIMESTAMP(3),
    "Amount" DECIMAL(10,2),

    CONSTRAINT "billinghistory_pkey" PRIMARY KEY ("HistoryID")
);

-- CreateTable
CREATE TABLE "comments" (
    "CommentID" SERIAL NOT NULL,
    "PostID" INTEGER NOT NULL,
    "UserID" INTEGER NOT NULL,
    "CommentText" TEXT NOT NULL,
    "CommentDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("CommentID")
);

-- CreateTable
CREATE TABLE "follows" (
    "FollowerID" INTEGER NOT NULL,
    "FollowingID" INTEGER NOT NULL,
    "FollowDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "follows_pkey" PRIMARY KEY ("FollowerID","FollowingID")
);

-- CreateTable
CREATE TABLE "invoices" (
    "InvoiceID" SERIAL NOT NULL,
    "SubscriptionID" INTEGER NOT NULL,
    "TotalAmount" DECIMAL(10,2),
    "DateIssued" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "DueDate" TIMESTAMP(3),
    "Status" VARCHAR(50),

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("InvoiceID")
);

-- CreateTable
CREATE TABLE "paymentmethods" (
    "PaymentMethodID" SERIAL NOT NULL,
    "UserID" INTEGER NOT NULL,
    "Provider" VARCHAR(255),
    "AccountDetails" TEXT,
    "IsDefault" BOOLEAN DEFAULT false,

    CONSTRAINT "paymentmethods_pkey" PRIMARY KEY ("PaymentMethodID")
);

-- CreateTable
CREATE TABLE "postlikes" (
    "PostID" INTEGER NOT NULL,
    "UserID" INTEGER NOT NULL,
    "LikeDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "postlikes_pkey" PRIMARY KEY ("PostID","UserID")
);

-- CreateTable
CREATE TABLE "posts" (
    "PostID" SERIAL NOT NULL,
    "UserID" INTEGER NOT NULL,
    "PostData" TEXT,
    "PostedDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("PostID")
);

-- CreateTable
CREATE TABLE "profiles" (
    "ProfileID" SERIAL NOT NULL,
    "UserID" INTEGER NOT NULL,
    "FullName" VARCHAR(255),
    "Bio" TEXT,
    "ProfilePicture" VARCHAR(255),
    "DateOfBirth" DATE,
    "Location" VARCHAR(255),

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("ProfileID")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "SubscriptionID" SERIAL NOT NULL,
    "UserID" INTEGER NOT NULL,
    "ApiID" INTEGER NOT NULL,
    "PlanID" INTEGER NOT NULL,
    "StartDate" TIMESTAMP(3),
    "EndDate" TIMESTAMP(3),
    "Status" VARCHAR(50),

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("SubscriptionID")
);

-- CreateTable
CREATE TABLE "transactions" (
    "TransactionID" SERIAL NOT NULL,
    "InvoiceID" INTEGER NOT NULL,
    "Amount" DECIMAL(10,2),
    "TransactionDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "PaymentMethodID" INTEGER,
    "Status" VARCHAR(50),

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("TransactionID")
);

-- CreateTable
CREATE TABLE "permissions" (
    "PermissionID" SERIAL NOT NULL,
    "Name" VARCHAR(255) NOT NULL,
    "Description" TEXT,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("PermissionID")
);

-- CreateTable
CREATE TABLE "moderatorpermissions" (
    "ModeratorPermissionID" SERIAL NOT NULL,
    "UserID" INTEGER,
    "PermissionID" INTEGER,

    CONSTRAINT "moderatorpermissions_pkey" PRIMARY KEY ("ModeratorPermissionID")
);

-- CreateTable
CREATE TABLE "apikeys" (
    "ApiKeyID" SERIAL NOT NULL,
    "SubscriptionID" INTEGER NOT NULL,
    "ApiKey" VARCHAR(255) NOT NULL,
    "CreationDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "IsActive" BOOLEAN DEFAULT true,

    CONSTRAINT "apikeys_pkey" PRIMARY KEY ("ApiKeyID")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_Email_key" ON "users"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "users_PhoneNumber_key" ON "users"("PhoneNumber");

-- CreateIndex
CREATE INDEX "moderatorpermissions_PermissionID_idx" ON "moderatorpermissions"("PermissionID");

-- CreateIndex
CREATE INDEX "moderatorpermissions_UserID_idx" ON "moderatorpermissions"("UserID");

-- CreateIndex
CREATE UNIQUE INDEX "apikeys_ApiKey_key" ON "apikeys"("ApiKey");

-- AddForeignKey
ALTER TABLE "billinghistory" ADD CONSTRAINT "billinghistory_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "users"("UserID") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "billinghistory" ADD CONSTRAINT "billinghistory_InvoiceID_fkey" FOREIGN KEY ("InvoiceID") REFERENCES "invoices"("InvoiceID") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_PostID_fkey" FOREIGN KEY ("PostID") REFERENCES "posts"("PostID") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "users"("UserID") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_FollowerID_fkey" FOREIGN KEY ("FollowerID") REFERENCES "users"("UserID") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_FollowingID_fkey" FOREIGN KEY ("FollowingID") REFERENCES "users"("UserID") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_SubscriptionID_fkey" FOREIGN KEY ("SubscriptionID") REFERENCES "subscriptions"("SubscriptionID") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "paymentmethods" ADD CONSTRAINT "paymentmethods_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "users"("UserID") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "postlikes" ADD CONSTRAINT "postlikes_PostID_fkey" FOREIGN KEY ("PostID") REFERENCES "posts"("PostID") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "postlikes" ADD CONSTRAINT "postlikes_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "users"("UserID") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "users"("UserID") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "users"("UserID") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "users"("UserID") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_InvoiceID_fkey" FOREIGN KEY ("InvoiceID") REFERENCES "invoices"("InvoiceID") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_PaymentMethodID_fkey" FOREIGN KEY ("PaymentMethodID") REFERENCES "paymentmethods"("PaymentMethodID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moderatorpermissions" ADD CONSTRAINT "moderatorpermissions_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "users"("UserID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moderatorpermissions" ADD CONSTRAINT "moderatorpermissions_PermissionID_fkey" FOREIGN KEY ("PermissionID") REFERENCES "permissions"("PermissionID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apikeys" ADD CONSTRAINT "apikeys_SubscriptionID_fkey" FOREIGN KEY ("SubscriptionID") REFERENCES "subscriptions"("SubscriptionID") ON DELETE RESTRICT ON UPDATE RESTRICT;
