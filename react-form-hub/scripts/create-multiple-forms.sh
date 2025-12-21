#!/bin/bash

# Script to create multiple feedback forms at once
# Usage: ./scripts/create-multiple-forms.sh

# Array of form definitions: "formNumber|titleEn|titleAr"
forms=(
	"3|Evaluation Tool 3|أداة تقييم 3"
	"4|Evaluation Tool 4|أداة تقييم 4"
	"5|Evaluation Tool 5|أداة تقييم 5"
	"6|Evaluation Tool 6|أداة تقييم 6"
	"7|Evaluation Tool 7|أداة تقييم 7"
	"8|Evaluation Tool 8|أداة تقييم 8"
	"9|Evaluation Tool 9|أداة تقييم 9"
	"10|Evaluation Tool 10|أداة تقييم 10"
	"11|Evaluation Tool 11|أداة تقييم 11"
	"12|Evaluation Tool 12|أداة تقييم 12"
	"13|Evaluation Tool 13|أداة تقييم 13"
	"14|Evaluation Tool 14|أداة تقييم 14"
	"15|Evaluation Tool 15|أداة تقييم 15"
	"16|Evaluation Tool 16|أداة تقييم 16"
	"17|Evaluation Tool 17|أداة تقييم 17"
)

echo "🚀 Creating multiple feedback forms..."
echo ""

for form in "${forms[@]}"; do
	IFS='|' read -r formNumber titleEn titleAr <<< "$form"
	node scripts/create-feedback-form.js "$formNumber" "$titleEn" "$titleAr"
	echo ""
	echo "---"
	echo ""
done

echo "✨ All forms created successfully!"
echo ""
echo "📝 Don't forget to create the corresponding form files in src/forms/"
echo "   Example: FeedbackForm-3.js, FeedbackForm-4.js, etc."
