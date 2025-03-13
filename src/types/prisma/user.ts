import * as z from "zod"
import { CompleteStatus, RelatedStatusModel, CompleteUserRole, RelatedUserRoleModel, CompleteUserPasswordHistory, RelatedUserPasswordHistoryModel, CompleteProduct, RelatedProductModel, CompleteCategory, RelatedCategoryModel, CompleteAttribute, RelatedAttributeModel, CompleteErrorLog, RelatedErrorLogModel, CompletePageView, RelatedPageViewModel, CompleteAuditLog, RelatedAuditLogModel, CompleteCart, RelatedCartModel, CompleteOrder, RelatedOrderModel, CompleteProductReview, RelatedProductReviewModel, CompleteUserWishlist, RelatedUserWishlistModel, CompleteConversionEvent, RelatedConversionEventModel, CompleteSetting, RelatedSettingModel, CompletePromotionUser, RelatedPromotionUserModel } from "./index"

export const UserModel = z.object({
  id: z.number().int(),
  username: z.string(),
  email: z.string(),
  email_verified: z.boolean(),
  password_hash: z.string(),
  status_id: z.number().int().nullish(),
  status_set_at: z.date().nullish(),
  status_set_until: z.date().nullish(),
  status_set_by: z.number().int().nullish(),
  created_at: z.date(),
  last_login_at: z.date().nullish(),
  login_attempts: z.number().int(),
  email_verification_token: z.string().nullish(),
  email_verification_expires: z.date().nullish(),
  two_factor_auth_enable: z.boolean(),
  first_name: z.string().nullish(),
  last_name: z.string().nullish(),
  phone_code: z.string().nullish(),
  phone_number: z.string().nullish(),
  phone_verified: z.boolean(),
})

export interface CompleteUser extends z.infer<typeof UserModel> {
  status?: CompleteStatus | null
  statusSetByUser?: CompleteUser | null
  setStatusForUsers: CompleteUser[]
  userRoles: CompleteUserRole[]
  userPasswordHistory: CompleteUserPasswordHistory[]
  productsCreated: CompleteProduct[]
  categoriesCreated: CompleteCategory[]
  attributesCreated: CompleteAttribute[]
  errorLogs: CompleteErrorLog[]
  pageViews: CompletePageView[]
  auditLogs: CompleteAuditLog[]
  carts: CompleteCart[]
  orders: CompleteOrder[]
  productReviews: CompleteProductReview[]
  userWishlists: CompleteUserWishlist[]
  conversionEvents: CompleteConversionEvent[]
  settingsSet: CompleteSetting[]
  promotionUsers: CompletePromotionUser[]
}

/**
 * RelatedUserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserModel: z.ZodSchema<CompleteUser> = z.lazy(() => UserModel.extend({
  /**
   * Связь на статус
   */
  status: RelatedStatusModel.nullish(),
  /**
   * Самоссылка: кто установил статус?
   */
  statusSetByUser: RelatedUserModel.nullish(),
  setStatusForUsers: RelatedUserModel.array(),
  /**
   * Связи на многие другие модели
   */
  userRoles: RelatedUserRoleModel.array(),
  userPasswordHistory: RelatedUserPasswordHistoryModel.array(),
  productsCreated: RelatedProductModel.array(),
  categoriesCreated: RelatedCategoryModel.array(),
  attributesCreated: RelatedAttributeModel.array(),
  errorLogs: RelatedErrorLogModel.array(),
  pageViews: RelatedPageViewModel.array(),
  auditLogs: RelatedAuditLogModel.array(),
  carts: RelatedCartModel.array(),
  orders: RelatedOrderModel.array(),
  productReviews: RelatedProductReviewModel.array(),
  userWishlists: RelatedUserWishlistModel.array(),
  conversionEvents: RelatedConversionEventModel.array(),
  settingsSet: RelatedSettingModel.array(),
  promotionUsers: RelatedPromotionUserModel.array(),
}))
