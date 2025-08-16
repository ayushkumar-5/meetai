import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const plans = [
    {
      name: "Monthly",
      price: "$29",
      period: "/month",
      description: "For teams getting started",
      features: [
        "Unlimited meetings",
        "Unlimited agents"
      ],
      buttonText: "Change Plan",
      buttonVariant: "outline" as const,
      highlight: false
    },
    {
      name: "Yearly",
      price: "$259",
      period: "/year",
      description: "For teams that need to scale",
      badge: "Best value",
      features: [
        "Unlimited meetings",
        "Unlimited agents",
        "2 months free"
      ],
      buttonText: "Manage",
      buttonVariant: "default" as const,
      highlight: true,
      current: true
    },
    {
      name: "Enterprise",
      price: "$999",
      period: "/year",
      description: "For teams with special requests",
      features: [
        "2 months free",
        "Unlimited meetings",
        "Unlimited agents",
        "Dedicated Discord Support"
      ],
      buttonText: "Change Plan",
      buttonVariant: "outline" as const,
      highlight: false
    }
  ];

  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Plan Status */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            You are on the <span className="text-blue-600">Yearly</span> plan
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your subscription and billing preferences
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative rounded-lg border-2 p-6 transition-all hover:shadow-lg ${
                plan.highlight
                  ? 'border-blue-500 bg-gradient-to-br from-blue-900 to-blue-800 text-white shadow-lg'
                  : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className={`text-xl font-semibold mb-2 ${
                  plan.highlight ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-4 ${
                  plan.highlight ? 'text-gray-200' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center">
                  <span className={`text-4xl font-bold ${
                    plan.highlight ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    {plan.price}
                  </span>
                  <span className={`text-lg ml-1 ${
                    plan.highlight ? 'text-gray-200' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {plan.period}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className={`text-sm font-semibold mb-3 ${
                  plan.highlight ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  FEATURES
                </h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className={`w-5 h-5 mr-3 ${
                        plan.highlight ? 'text-white' : 'text-blue-500'
                      }`} />
                      <span className={`text-sm ${
                        plan.highlight ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                variant={plan.buttonVariant}
                className={`w-full ${
                  plan.highlight 
                    ? 'bg-white text-blue-900 hover:bg-gray-100 border-white' 
                    : ''
                }`}
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Need help with your subscription? Contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
