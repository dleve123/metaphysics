import { graphql, GraphQLNonNull, GraphQLString } from "graphql"
import { OrderInterface } from "schema/ecommerce/types/order"
import { AllOrderFields } from "./query_helpers"
import gql from "lib/gql"
import { extractEcommerceResponse } from "./extractEcommerceResponse"

export const Order = {
  name: "Order",
  type: OrderInterface,
  description: "Returns a single Order",
  args: { id: { type: new GraphQLNonNull(GraphQLString) } },
  resolve: (_parent, { id }, context, { rootValue: { exchangeSchema } }) => {
    const query = gql`
      query EcommerceOrder($id: ID, $code: String) {
        ecommerceOrder(id: $id, code: $code) {
          ${AllOrderFields}
          lineItems{
            edges{
              node{
                __typename
                id
                priceCents
                artworkId
                editionSetId
                quantity
                fulfillments{
                  edges{
                    node{
                      id
                      courier
                      trackingId
                      estimatedDelivery
                    }
                  }
                }
              }
            }
          }
        }
      }
    `
    return graphql(exchangeSchema, query, null, context, {
      id,
    }).then(extractEcommerceResponse("ecommerceOrder"))
  },
}
