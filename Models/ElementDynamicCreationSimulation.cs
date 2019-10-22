using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NeedOfVigilante.Models
{
    public class ElementDynamicCreationSimulation
    {
        //Start Adición de Elementos --Posteriormente vendran de la base de datos
        public Element createElement()
        {
            Element element = new Element();
            element.id = 1;
            element.idBranchOffice = "030";
            element.idQuestion = 224;
            element.question = "Cuantas Armas tienen los agentes?";
            element.category = MyEnums.Categories.Pregunta.ToString();
            element.entryType = MyEnums.InputOutputTypes.NumericValue;
            element.entryValue = "7";
            element.outcomes = new List<Outcome>(); 
            return element;
        }

        public List<Outcome> createOutcomes(Element element) 
        {
            // The Quantity of outcomes, and their expressions, should be done dynamically

            //First Outcome - Output value is: 0
            Outcome firstOutcome = new Outcome();
            firstOutcome.id = 1;
            firstOutcome.outputType = MyEnums.InputOutputTypes.NumericValue;
            firstOutcome.outputExpression = new NumericValue();
            
            /* Se asume que con las comparaciones el entryValue representa la X y tiene adicionalmente un operador y un valor numerico */
            element.outcomes.Add(firstOutcome);

            //Second Outcome - Output value is: x= 1
            Outcome secondOutcome = new Outcome();
            secondOutcome.id = 2;
            secondOutcome.outputExpression = new NumericValue(); ;
            secondOutcome.outputType = MyEnums.InputOutputTypes.NumericValue;
            
            element.outcomes.Add(secondOutcome);

            //Third Outcome - Output value is: x >= 2
            Outcome thirdOutcome = new Outcome();
            thirdOutcome.id = 3;
            thirdOutcome.outputType = MyEnums.InputOutputTypes.Comparison;
            thirdOutcome.outputExpression = new Comparison(); ;
            element.outcomes.Add(thirdOutcome);

            return element.outcomes;
        }

        public void assignExpressionsToOutcomes(Element element)
        {
            //This for should only be used for testing purposes
            //int numberOfOutcomes = 3; //Settled programatically for testing purposes. Should be dynamically from user input.

            for (int x = 0; x < element.outcomes.Count; x++)
            {
                switch (element.outcomes.ElementAt(x).id)
                {
                    case 1:

                        NumericValue numericValue = new NumericValue();
                        numericValue.value = 0; // 
                        element.outcomes.ElementAt(x).outputExpression = numericValue;
                        element.outcomes.ElementAt(x).nextIdElement = 91;
                        break;

                    case 2:

                        NumericValue numericValue2 = new NumericValue();
                        numericValue2.value = 1; // 
                        element.outcomes.ElementAt(x).outputExpression = numericValue2;
                        element.outcomes.ElementAt(x).nextIdElement = 287;
                        break;

                    case 3:

                        Comparison comparison = new Comparison();
                        comparison.unknownValue = Double.Parse(element.entryValue);
                        comparison.comparisonOperator = MyEnums.Operators.MoreAndEqualTo;
                        comparison.knownValue = 2;
                        element.outcomes.ElementAt(x).outputExpression = comparison ;
                        element.outcomes.ElementAt(x).nextIdElement = 92;
                        break;

                }


            }

            /* Should be the method used in production. 
             * 
            for (int x = 0; x < element.outcomes.Count; x++)
            {
                switch (element.outcomes.ElementAt(x).outputType)
                {
                    case MyEnums.InputOutputTypes.NumericValue:

                        NumericValue numericValue = new NumericValue();
                        numericValue.value = Double.Parse(element.entryValue); // 
                        element.outcomes.ElementAt(x).outputExpression.Add(numericValue);
                        break;

                    case MyEnums.InputOutputTypes.Comparison:

                        Comparison comparison = new Comparison();
                        comparison.UnknownValue = Double.Parse(element.entryValue);
                        comparison.comparisonOperator = MyEnums.Operators.MoreAndEqualTo;
                        comparison.KnownValue = 2;
                        element.outcomes.ElementAt(x).outputExpression.Add(comparison);
                        break;

                }
        
            }
             * */
            //End Adicion de elementos



        }
    }
}