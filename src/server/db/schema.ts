import { relations } from "drizzle-orm";
import {
  index,
  pgEnum,
  pgTableCreator,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const createTable = pgTableCreator((name) => `padpal_${name}`);

export const expenseCategory = pgEnum("expense_category", [
  "housing", // rent, mortgage

  "utilities", // electric, water, gas, internet, phone

  "groceries",
  "dining",

  "transportation", // gas, parking, transit
  "vehicle", // car payment, maintenance, registration

  "insurance", // car, renters, health

  "debt", // student loans, credit cards, personal loans

  "subscriptions", // Netflix, Spotify, ChatGPT, gym

  "shopping", // clothes, household

  "healthcare",

  "entertainment",

  "other",
]);

export const expenses = createTable(
  "expense",
  (d) => ({
    id: d
      .text()
      .primaryKey()
      .$defaultFn(() => createId()),
    orgId: d.text().references(() => organization.id, { onDelete: "cascade" }),
    userId: d.text().references(() => user.id, { onDelete: "set null" }),
    name: d.text().notNull(),
    isShared: d.boolean().notNull().default(false),
    amount: d.bigint({ mode: "number" }).notNull(),
    category: expenseCategory().notNull(),
    createdAt: d.timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: d
      .timestamp({ withTimezone: true })
      .defaultNow()
      .$onUpdateFn(() => new Date())
      .notNull(),
  }),
  (table) => [
    index("expense_org_id_idx").on(table.orgId),
    index("expense_user_id_idx").on(table.userId),
    index("expense_category_idx").on(table.category),
  ],
);

export type Expense = typeof expenses.$inferSelect;
export type ExpenseInput = typeof expenses.$inferInsert;

export const user = createTable("user", (d) => ({
  id: d.text("id").primaryKey(),
  name: d.text("name").notNull(),
  email: d.text("email").notNull().unique(),
  emailVerified: d.boolean("email_verified").default(false).notNull(),
  image: d.text("image"),
  createdAt: d.timestamp("created_at").defaultNow().notNull(),
  updatedAt: d
    .timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
}));

export const session = createTable(
  "session",
  (d) => ({
    id: d.text("id").primaryKey(),
    expiresAt: d.timestamp("expires_at").notNull(),
    token: d.text("token").notNull().unique(),
    createdAt: d.timestamp("created_at").defaultNow().notNull(),
    updatedAt: d
      .timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: d.text("ip_address"),
    userAgent: d.text("user_agent"),
    userId: d
      .text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    activeOrganizationId: d.text("active_organization_id"),
  }),
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = createTable(
  "account",
  (d) => ({
    id: d.text("id").primaryKey(),
    accountId: d.text("account_id").notNull(),
    providerId: d.text("provider_id").notNull(),
    userId: d
      .text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: d.text("access_token"),
    refreshToken: d.text("refresh_token"),
    idToken: d.text("id_token"),
    accessTokenExpiresAt: d.timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: d.timestamp("refresh_token_expires_at"),
    scope: d.text("scope"),
    password: d.text("password"),
    createdAt: d.timestamp("created_at").defaultNow().notNull(),
    updatedAt: d
      .timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  }),
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = createTable(
  "verification",
  (d) => ({
    id: d.text("id").primaryKey(),
    identifier: d.text("identifier").notNull(),
    value: d.text("value").notNull(),
    expiresAt: d.timestamp("expires_at").notNull(),
    createdAt: d.timestamp("created_at").defaultNow().notNull(),
    updatedAt: d
      .timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  }),
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const organization = createTable(
  "organization",
  (d) => ({
    id: d.text("id").primaryKey(),
    name: d.text("name").notNull(),
    slug: d.text("slug").notNull().unique(),
    logo: d.text("logo"),
    createdAt: d.timestamp("created_at").notNull(),
    metadata: d.text("metadata"),
  }),
  (table) => [uniqueIndex("organization_slug_uidx").on(table.slug)],
);

export const member = createTable(
  "member",
  (d) => ({
    id: d.text("id").primaryKey(),
    organizationId: d
      .text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    userId: d
      .text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: d.text("role").default("member").notNull(),
    createdAt: d.timestamp("created_at").notNull(),
  }),
  (table) => [
    index("member_organizationId_idx").on(table.organizationId),
    index("member_userId_idx").on(table.userId),
  ],
);

export const invitation = createTable(
  "invitation",
  (d) => ({
    id: d.text("id").primaryKey(),
    organizationId: d
      .text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    email: d.text("email").notNull(),
    role: d.text("role"),
    status: d.text("status").default("pending").notNull(),
    expiresAt: d.timestamp("expires_at").notNull(),
    createdAt: d.timestamp("created_at").defaultNow().notNull(),
    inviterId: d
      .text("inviter_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  }),
  (table) => [
    index("invitation_organizationId_idx").on(table.organizationId),
    index("invitation_email_idx").on(table.email),
  ],
);

export const expenseRelations = relations(expenses, ({ one }) => ({
  organization: one(organization, {
    fields: [expenses.orgId],
    references: [organization.id],
  }),
  user: one(user, {
    fields: [expenses.userId],
    references: [user.id],
  }),
}));

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  members: many(member),
  invitations: many(invitation),
  expenses: many(expenses),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const organizationRelations = relations(organization, ({ many }) => ({
  members: many(member),
  invitations: many(invitation),
  expenses: many(expenses),
}));

export const memberRelations = relations(member, ({ one }) => ({
  organization: one(organization, {
    fields: [member.organizationId],
    references: [organization.id],
  }),
  user: one(user, {
    fields: [member.userId],
    references: [user.id],
  }),
}));

export const invitationRelations = relations(invitation, ({ one }) => ({
  organization: one(organization, {
    fields: [invitation.organizationId],
    references: [organization.id],
  }),
  user: one(user, {
    fields: [invitation.inviterId],
    references: [user.id],
  }),
}));
