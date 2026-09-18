class PagesController < ApplicationController
  def home
    @journey_steps = [
      ["Find", "DTC and HCP Audiences drive scalable reach across all channels"],
      ["Anticipate", "Predictive Audiences reach patients before key health events"],
      ["Educate", "Intelligent Search and Chat guide intent on brand.com"],
      ["Connect", "Condition-specific communities strengthen patient engagement"],
      ["Convert", "Rx solutions support first fills and sustained adherence"]
    ]

    @solution_groups = {
      "Who to target?" => [
        ["DTC Audiences", "Uncover the most relevant patients for your brand."],
        ["HCP Audiences", "Quantify every HCP's brand value beyond traditional segmentation."],
        ["Predictive Audiences", "Reach audiences before critical health milestones occur."]
      ],
      "Where to engage?" => [
        ["TV Audiences", "Unify planning, activation and measurement across every screen."],
        ["Communities", "Build direct relationships in opted-in, condition-specific communities."]
      ],
      "What to do?" => [
        ["Agentic Platform", "Turn complex data into clear, actionable commercial decisions."],
        ["Web Solutions", "Transform patient questions into real-time answers and guidance."]
      ]
    }
  end

  def about; end
  def solutions; end
end
