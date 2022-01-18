---
sidebar_position: 1
---

# HTTP REST

All API requests are done to `http://localhost:{port}` URL where `port` is port which was set during installation (you can always check it in `Kestrel -> EndPoints -> Http -> Url` section in appsettings.json file).

:::tip

You could test HTTP api with your any favourite tool. If you don't have it then it's recommended to use [Postman](https://www.postman.com/downloads/).

:::

## GET actions

### `/GetState`

Returns states of all items.

:::caution

Note that this action **does not** return states which are enumerated in `AppSettings -> UncachedItems` section in appsettings.json file. You can get state of those items with one of actions below.

:::


### `/GetState/{itemId}`

Returns state for item with provided id.

### `/GetState/{itemId}/{parameter}/{locale?}`

Returns value of state for provided item and parameter (i.e. state key).

`locale` - optional parameter, use it for example if you setup integration with other system working in different locale. If not provided then value will be returned in default system culture format (can be found in `AppSettings -> ApiCulture` in appsettings.json file).

### `/Execute/{itemId}/{command}?{query_parameters}`

Returns result of executing command by item with provided id. The action is useful for cases when item produces data like byte array or something else and (or) it's needed to request it **synchronously**.

## POST actions

### `/SetValue/{itemId}/{parameter}/{value?}/{type?}/{locale?}`

Set value of state for provided item and parameter (i.e. state key).

`value` - optional parameter. If it's not set then value will be considered as null.

`type` - type of value (this parameter is not needed in case if `value` parameter is not provided).
SmartHomeApi works with typed data.

SmartHomeApi input data types are:

| Name     | Description   | Example |
| ---------|:-------------|:-----------------------------------:|
| String   | String value              | Test |
| Integer  | Integral value in range from $-2,147,483,648$ to $2,147,483,647$ | 1234 |
| Double   | Floating-point value in range from $±5.0 × 10^{−324}$ to $±1.7 × 10^{308}$ | 1234.0 |
| Decimal  | Decimal floating-point value in range from $±1.0 × 10^{-28}$ to $±7.9228 × 10^{28}$ | 1234.0 |
| Boolean  | Boolean value, which can be `true`, `false`, `0` or `1` (0 and 1 will be converted to normal .NET boolean value) | true |
| DateTime | Value containing Date and Time part | 01.01.2022 17:50:00 |
| TimeSpan | Value containing Time | 17:50:00 |

`locale` - optional parameter, use it for example if you setup integration with other system working in different locale. If not provided then `value` will be considered as it is in default system culture format (can be found in `AppSettings -> ApiCulture` in appsettings.json file).

### `/Execute/{itemId}/{command}?{query_parameters}`

Returns result of executing command by item with provided id. The action is useful for cases when item produces data like byte array or something else and (or) it's needed to request it **synchronously**.

**Since it's POST http method then it supports JSON object in http body.** SmartHomeApi will try to convert JSON to `IDictionary<string, object>`.